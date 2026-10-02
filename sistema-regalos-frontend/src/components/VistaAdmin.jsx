import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../hooks/useAuth';

export default function VistaAdmin() {
  const { profile } = useAuth();
  
  // Estados para Territorios
  const [resumenTerritorios, setResumenTerritorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [territorioSeleccionado, setTerritorioSeleccionado] = useState(null);
  const [beneficiariosTerritorio, setBeneficiariosTerritorio] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [busquedaDetalle, setBusquedaDetalle] = useState('');

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      const resumen = await adminService.obtenerResumenGeneral();
      setResumenTerritorios(resumen);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarTerritorio = async (terr) => {
    try {
      setTerritorioSeleccionado(terr);
      setLoadingDetalle(true);
      const lista = await adminService.obtenerBeneficiariosPorTerritorio(terr.id);
      setBeneficiariosTerritorio(lista);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const volverAlResumen = () => {
    setTerritorioSeleccionado(null);
    setBeneficiariosTerritorio([]);
    setBusquedaDetalle('');
  };

  const beneficiariosFiltrados = beneficiariosTerritorio.filter(b => 
    b.rut_menor.includes(busquedaDetalle) || 
    b.rut_adulto_responsable.includes(busquedaDetalle) ||
    `${b.nombres} ${b.apellidos}`.toLowerCase().includes(busquedaDetalle.toLowerCase())
  );

  const totalComuna = resumenTerritorios.reduce((acc, curr) => acc + curr.totalInscritos, 0);
  const totalEntregadosComuna = resumenTerritorios.reduce((acc, curr) => acc + curr.totalEntregados, 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A87]"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
      <div className="flex items-center text-red-700 font-medium">
        Error en el panel de administración: {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Encabezado Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Panel Administrador Municipal
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Supervisión global de territorios y control de la campaña navideña.
          </p>
        </div>
        <div className="flex items-center bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
          <span className="text-[#004A87] font-semibold text-sm">👤 {profile?.nombre_completo || 'Administrador'}</span>
        </div>
      </div>

      {territorioSeleccionado ? (
        /* VISTA DE DETALLE DE UN TERRITORIO */
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={volverAlResumen}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center font-semibold text-sm"
              >
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a Territorios
              </button>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {territorioSeleccionado.nombre}
                </h3>
                <p className="text-sm text-gray-500">
                  Territorio #{territorioSeleccionado.numero_territorio} • {beneficiariosTerritorio.length} menores inscritos
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por RUT o Nombre del menor o tutor..."
              value={busquedaDetalle}
              onChange={(e) => setBusquedaDetalle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#004A87] focus:border-transparent outline-none bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingDetalle ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A87]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Menor</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Edad / Rango</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tutor Responsable</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {beneficiariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No se encontraron menores inscritos en este territorio.
                        </td>
                      </tr>
                    ) : (
                      beneficiariosFiltrados.map((b) => (
                        <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{b.nombres} {b.apellidos}</div>
                            <div className="text-sm text-gray-500 font-mono">{b.rut_menor}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{b.edad} años</div>
                            <div className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{b.rango_etario}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-700">{b.nombre_adulto_responsable}</div>
                            <div className="text-xs text-gray-400 font-mono">{b.rut_adulto_responsable}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              b.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {b.estado || 'Inscrito'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VISTA GENERAL DE TERRITORIOS Y TARJETAS */
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Total Inscritos Comuna</p>
                <p className="text-4xl font-black text-gray-900 mt-1">{totalComuna}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl text-[#004A87]">📦</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">Regalos Entregados</p>
                <p className="text-4xl font-black text-green-600 mt-1">{totalEntregadosComuna}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl text-green-600">🎁</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Territorios (Juntas de Vecinos)</h3>
              <p className="text-sm text-gray-500">Selecciona un territorio para ver su listado de beneficiarios.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Territorio / JJVV</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Inscritos</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Entregados</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Progreso</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resumenTerritorios.map((terr) => {
                    const porcentaje = terr.totalInscritos > 0 ? Math.round((terr.totalEntregados / terr.totalInscritos) * 100) : 0;
                    return (
                      <tr key={terr.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{terr.nombre}</div>
                          <div className="text-xs text-gray-400">Territorio #{terr.numero_territorio}</div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#004A87]">{terr.totalInscritos}</td>
                        <td className="px-6 py-4 text-center font-bold text-green-600">{terr.totalEntregados}</td>
                        <td className="px-6 py-4 w-1/4">
                          <div className="text-xs font-semibold text-gray-600 mb-1">{porcentaje}%</div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-[#004A87] h-2.5 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => seleccionarTerritorio(terr)}
                            className="px-4 py-2 bg-[#004A87] hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                          >
                            Ver Inscritos
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}