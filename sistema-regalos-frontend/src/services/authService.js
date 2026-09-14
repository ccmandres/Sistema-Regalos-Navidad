// Contiene las llamadas directas a la API de Supabase.

import { supabase } from '../lib/supabaseClient';

export const authService = {
// Inicia Sesion con correo y contraseña en Supabase auth

async login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
},

// Cierra la sesion activa
async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
},

// Obtiene el perfil extendido del usuario autenticado desde la tabla 'perfiles' Retorna el rol ('Administrador Municipal', 'Operador Municipal', 'Dirigente de Junta de Vecinos')y el territorio_id asignado.

async getUserProfile(userId) {
    if (!userId) {return null;} // Verificar si userId es nulo o indefinido
    const { data, error } = await supabase
        .from('perfiles')
        .select('rol, territorio_id')
        .eq('id', userId)
        .single();
    if (error) {
        console.error('Error al obtener el perfil del usuario:', error.message);
        return null;
    }

    // Verificar si la cuenta esta activa
    if (data && !data.activo) { // Suponiendo que hay un campo 'activo' en la tabla 'perfiles'
        throw new Error('La cuenta del usuario no está activa.');
    }
    return data;
    }
}; 
