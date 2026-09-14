import { supabase } from "../lib/supabaseClient";

export const beneficiariosService = {
    // LISTAR: Obtiene la lista de beneficiarios asociados a un territorio_id específico desde la tabla 'beneficiarios'. Retorna un array de objetos con todos los campos. RLS de supabase, si el usuario es 'Dirigente de Juta de Vecinos', solo podrá ver los beneficiarios asociados a su territorio_id. Si el usuario es 'Administrador Municipal' o 'Operador Municipal', podrá ver todos los beneficiarios.

    async getBeneficiarios() {
        const { data, error } = await supabase
            .from('beneficiarios')
            .select(`*`)
            .order('created_at', { ascending: false });
        if (error) {
            console.log(' Error al obtener la lista de beneficiarios:', error.message);
            throw new Error('Error al obtener la lista de beneficiarios');
        }
        return data;
    },

    // BUSCAR: Buscar a un menor o tutor por RUT o nombre en tiempo real desde la tabla 'beneficiarios'. Retorna un array de objetos con todods los campos. RLS de supabase, si el usuario es 'Dirigente de Juta de Vecinos', solo podrá ver los beneficiarios asociados a su territorio_id. Si el usuario es 'Administrador Municipal' o 'Operador Municipal', podrá ver todos los beneficiarios.
    // @param {string} termino - RUT o nombre del menor o tutor a buscar.

    async buscarBeneficiarios(termino) {
        if (!termino || termino.trim() === '') {
            return this.getBeneficiarios(); // Si el término de búsqueda está vacío, retorna todos los beneficiarios
        }

        const busqueda = `%${termino.trim()}%`;

        const { data, error } = await supabase
            .from('beneficiarios')
            .select(`*`)
            .or(`rut_menor.ilike.${busqueda},nombres.ilike.${busqueda},apellidos.ilike.${busqueda},rut_adulto_responsable.ilike.${busqueda},nombre_adulto_responsable.ilike.${busqueda}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Error al buscar beneficiarios:', error.message);
            throw new Error('Error al buscar beneficiarios');
        }

        return data;
    },

    // INSERTAR: Agrega un nuevo beneficiario a la tabla 'beneficiarios'. Incluye la deteccion de duplicados via la restriccion de UNIQUE(rut_menor) en la tabla 'beneficiarios'. Retorna el objeto del beneficiario insertado con los campos: id, rut_menor, nombres, apellidos, fecha_nacimiento, edad, rut_adulto_responsable, nombre_adulto_responsable
    // @param {Object} beneficiario

    async crearBeneficiario(datosMenor) {
        const { 
            rut_menor,
            nombres,
            apellidos,
            fecha_nacimiento,
            rango_etario,
            sexo,
            rut_adulto_responsable,
            nombre_adulto_responsable
        } = datosMenor;

        const { data, error } = await supabase
            .from('beneficiarios')
            .insert([{
                rut_menor,
                nombres,
                apellidos,
                fecha_nacimiento,
                rango_etario,
                sexo,
                rut_adulto_responsable,
                nombre_adulto_responsable
            }])
            .select()
            .single();

        if (error) {
            // Codigo de error de PostgreSQL para clave duplicada (violación de restricción UNIQUE)
            if (error.code === '23505') {
                throw new Error('El RUT ${rut_menor} del menor ya está registrado.');
            }

            // Violacion de politicas RLS o permisos
            if (error.code === '42501') {
                throw new Error('No tienes permisos para crear un beneficiario en este territorio.');
            }
            // Otros errores
            console.log('Error al crear beneficiario:', error.message);
            throw new Error('Error al crear beneficiario');
        }

        return data;
    }
};