import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function VistaDirigente() {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarBeneficiarios();
  }, []);

  const cargarBeneficiarios = async () => {
    try {
      setLoading(true);

      // Obtiene el usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("No hay una sesión activa.");

      // Obtiene el territorio_id del perfil del dirigente
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('territorio_id')
        .eq('id', user.id)
        .single();

      if (perfilError) throw new Error("No se pudo obtener el perfil del dirigente.");
      
      const territorioDirigente = perfil.territorio_id;

      // Filtra los beneficiarios estrictamente por ese territorio
      const { data: listaBeneficiarios, error: benError } = await supabase
        .from('beneficiarios')
        .select('*')
        .eq('territorio_id', territorioDirigente)
        .order('apellidos', { ascending: true }); // Orden alfabético

      if (benError) throw new Error("Error al cargar la lista de beneficiarios.");

      setBeneficiarios(listaBeneficiarios);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando base de datos del territorio...</div>;
  if (error) return <div className="p-6 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Beneficiarios de tu Territorio
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Total: {beneficiarios.length} inscritos
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 uppercase text-gray-600 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">RUT Menor</th>
              <th className="px-6 py-3 border-b">Nombre Completo</th>
              <th className="px-6 py-3 border-b">Edad/Rango</th>
              <th className="px-6 py-3 border-b">Adulto Responsable</th>
              <th className="px-6 py-3 border-b text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {beneficiarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No hay beneficiarios registrados en tu territorio.
                </td>
              </tr>
            ) : (
              beneficiarios.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{b.rut_menor}</td>
                  <td className="px-6 py-4">{b.nombres} {b.apellidos}</td>
                  <td className="px-6 py-4">
                    {b.edad} años <span className="text-gray-400 text-xs ml-1">({b.rango_etario})</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{b.nombre_adulto_responsable}</p>
                    <p className="text-xs text-gray-500">{b.rut_adulto_responsable}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      b.estado === 'Activo' || b.estado === 'Validado' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
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
    </div>
  );
}