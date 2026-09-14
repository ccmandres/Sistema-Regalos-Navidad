// Contexto global de React para compartir la sesión, el usuario y su perfil con toda la aplicación.
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener sesión activa al cargar la aplicación
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) { // ?.user significa que solo se ejecutará si session no es null o undefined
                    setUser(session.user);
                    const userProfile = await authService.getUserProfile(session.user.id);
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error('Error al obtener la sesión inicial:', error.message);
            } finally { // finally significa que se ejecutará después del try y catch, sin importar si hubo un error o no
                setLoading(false);
            }
        };

        getInitialSession();
        // Escuchar cambios de estado en la sesión (login, logout, etc.)

        const { data: {susbscription} } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                const userProfile = await authService.getUserProfile(session.user.id);
                setProfile(userProfile);
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            susbscription?.unsubscribe();
        };
    }, []);

    // Función de Login expuesta a la interfaz
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            const userProfile = await authService.getUserProfile(data.user.id);
            setUser(data.user);
            setProfile(userProfile);
            return {user: data.user, profile: userProfile};
            } finally {
            setLoading(false);
        }
    };

    // Función de Logout expuesta a la interfaz
    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        profile,
        loading,
        login,
        logout,
        // Helpers de rol para usar rapidamente en las vistas
        isAdmin: profile?.role === 'Administrador Minucipal',
        isOperador: profile?.role === 'Operador Municipal',
        isDirigente: profile?.role === 'Dirigente de Junta de Vecinos',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};