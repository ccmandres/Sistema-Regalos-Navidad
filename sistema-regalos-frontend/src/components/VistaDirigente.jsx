import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { beneficiariosService } from '../services/beneficiariosService';
import { formatearRut, validarRut } from '../utils/rutUtils';
import { useAuth } from '../hooks/useAuth';

export default function VistaDirigente() {
  const { profile } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  

  
  const estadoInicialForm = {
    rut_menor: '', nombres: '', apellidos: '', fecha_nacimiento: '',
    sexo: '', rut_adulto_responsable: '', nombre_adulto_responsable: ''
  };
  const [formData, setFormData] = useState(estadoInicialForm);

  useEffect(() => {
    cargarBeneficiarios();
  }, []);

  const cargarBeneficiarios = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("No hay una sesión activa.");

      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('territorio_id')
        .eq('id', user.id)
        .single();

      if (perfilError) throw new Error("No se pudo obtener el perfil del dirigente.");
      
      const { data: listaBeneficiarios, error: benError } = await supabase
        .from('beneficiarios')
        .select('*')
        .eq('territorio_id', perfil.territorio_id)
        .order('apellidos', { ascending: true });

      if (benError) throw new Error("Error al cargar la lista de beneficiarios.");
      setBeneficiarios(listaBeneficiarios);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const calcularEdadYRango = (fechaNacimiento) => {
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }

    let rango = '';
    // Los textos ahora coinciden letra por letra con la restricción de Supabase
    if (edad >= 0 && edad <= 3) rango = '0-3';
    else if (edad >= 4 && edad <= 7) rango = '4-7';
    else if (edad >= 8 && edad <= 10) rango = '8-10';
    else rango = 'Fuera de rango';

    return { edad, rango };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validarRut(formData.rut_menor)) return setFormError("El RUT del menor es inválido.");
    if (!validarRut(formData.rut_adulto_responsable)) return setFormError("El RUT del adulto responsable es inválido.");

    const { edad, rango } = calcularEdadYRango(formData.fecha_nacimiento);
    if (edad > 10 || edad < 0) return setFormError("El beneficio es exclusivo para niños hasta los 10 años.");

    setFormLoading(true);
    try {
      const nuevoRegistro = await beneficiariosService.crearBeneficiario({
        ...formData,
        edad,
        rango_etario: rango,
        territorio_id: profile.territorio_id
      });
      setBeneficiarios([nuevoRegistro, ...beneficiarios]);
      setMostrarFormulario(false);
      setFormData(estadoInicialForm);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const beneficiariosFiltrados = beneficiarios.filter(b => 
    b.rut_menor.includes(busqueda) || 
    b.rut_adulto_responsable.includes(busqueda) ||
    `${b.nombres} ${b.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A87]"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
      <div className="flex items-center text-red-700 font-medium">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error: {error}
      </div>
    </div>
  );

  // Clases CSS reutilizables para el formulario
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#004A87] focus:border-transparent transition-all duration-200 outline-none";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Tarjeta de Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Gestión de Beneficiarios
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Administra los registros de tu territorio para la campaña navideña.
          </p>
        </div>
        <div className="flex items-center bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
          <svg className="w-5 h-5 text-[#004A87] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[#004A87] font-semibold">{beneficiarios.length} Inscritos</span>
        </div>
      </div>

      {/* Barra de Búsqueda y Botón de Acción */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por RUT o Nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#004A87] focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className={`flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 ${
            mostrarFormulario 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
            : 'bg-[#004A87] hover:bg-blue-800 shadow-blue-200'
          }`}
        >
          {mostrarFormulario ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Cancelar Registro
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Nuevo Beneficiario
            </>
          )}
        </button>
      </div>

      {/* Formulario Estilizado */}
      {mostrarFormulario && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 origin-top">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800">Formulario de Inscripción</h3>
            <p className="text-sm text-gray-500">Complete cuidadosamente los datos del menor y su tutor.</p>
          </div>
          
          {formError && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center border border-red-100">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bloque Menor */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-50">
              <h4 className="flex items-center font-bold text-[#004A87] mb-5 text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Información del Menor
              </h4>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>RUT (con guion)</label>
                  <input type="text" required placeholder="12.345.678-9" value={formData.rut_menor} onChange={(e) => setFormData({...formData, rut_menor: formatearRut(e.target.value)})} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nombres</label>
                    <input type="text" required placeholder="Ej. Juan Andrés" value={formData.nombres} onChange={(e) => setFormData({...formData, nombres: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Apellidos</label>
                    <input type="text" required placeholder="Ej. Pérez Soto" value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Fecha Nacimiento</label>
                    <input type="date" required value={formData.fecha_nacimiento} onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Sexo</label>
                    <select required value={formData.sexo} onChange={(e) => setFormData({...formData, sexo: e.target.value})} className={inputClass}>
                      <option value="">Seleccione...</option>
                      <option value="Niña">Femenino (Niña)</option>
                      <option value="Niño">Masculino (Niño)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque Adulto */}
            <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h4 className="flex items-center font-bold text-gray-700 mb-5 text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Tutor o Responsable
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>RUT Adulto</label>
                    <input type="text" required placeholder="12.345.678-9" value={formData.rut_adulto_responsable} onChange={(e) => setFormData({...formData, rut_adulto_responsable: formatearRut(e.target.value)})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nombre Completo</label>
                    <input type="text" required placeholder="Ej. María Soto González" value={formData.nombre_adulto_responsable} onChange={(e) => setFormData({...formData, nombre_adulto_responsable: e.target.value})} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full flex justify-center items-center bg-green-500 text-white p-3.5 rounded-xl font-bold text-lg hover:bg-green-600 focus:ring-4 focus:ring-green-200 transition-all shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  )}
                  {formLoading ? 'Procesando...' : 'Guardar Registro'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Resultados Modernizada */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Menor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Edad</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tutor Responsable</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {beneficiariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    {busqueda ? 'No se encontraron resultados.' : 'Aún no hay inscritos en este territorio.'}
                  </td>
                </tr>
              ) : (
                beneficiariosFiltrados.map((b) => (
                  <tr key={b.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{b.nombres} {b.apellidos}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{b.rut_menor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{b.edad} años</div>
                      <div className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{b.rango_etario}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{b.nombre_adulto_responsable}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{b.rut_adulto_responsable}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        b.estado === 'Activo' || b.estado === 'Validado' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          b.estado === 'Activo' || b.estado === 'Validado' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></span>
                        {b.estado || 'Inscrito'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}