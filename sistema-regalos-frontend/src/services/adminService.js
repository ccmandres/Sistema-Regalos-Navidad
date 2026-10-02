import { supabase } from '../lib/supabaseClient';

export const adminService = {
    // Obtener todos los territorios de la comuna
    async obtenerTerritorios() {
        const { data, error } = await supabase
            .from('territorios')
            .select('*')
            .order('nombre_jjvv', { ascending: true });
        
        if (error) throw new Error(error.message);
        return data;
    },

    // Obtener un resumen global y estadísticas por territorio
    async obtenerResumenGeneral() {
        try {
            const territorios = await this.obtenerTerritorios();

            const { data: beneficiarios, error: benError } = await supabase
                .from('beneficiarios')
                .select('id, territorio_id, rango_etario, estado');

            if (benError) throw new Error(benError.message);

            const resumen = territorios.map(terr => {
                const inscritosTerritorio = beneficiarios.filter(b => b.territorio_id === terr.id);
                const entregados = inscritosTerritorio.filter(b => b.estado === 'Entregado').length;

                return {
                    ...terr,
                    nombre: terr.nombre_jjvv,
                    totalInscritos: inscritosTerritorio.length,
                    totalEntregados: entregados
                };
            });

            return resumen;
        } catch (error) {
            console.error("Error al obtener resumen comunal:", error.message);
            throw error;
        }
    },

    // Obtener beneficiarios específicos de un territorio seleccionado
    async obtenerBeneficiariosPorTerritorio(territorioId) {
        const { data, error } = await supabase
            .from('beneficiarios')
            .select('*')
            .eq('territorio_id', territorioId)
            .order('apellidos', { ascending: true });

        if (error) throw new Error(error.message);
        return data;
    }
};