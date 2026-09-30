// Contexto global de React para compartir la sesión, el usuario y su perfil con toda la aplicación.
import { createContext, useContext, useState, useEffect, use } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserProfile = async (userId) => {
        try {
            const userProfile = await authService.getUserProfile(userId);
            setProfile(userProfile);
        } catch (error) {
            console.error ('Error al cargar perfil: ', error.message);
            setProfile(null);
        }
    };

    useEffect(() => {
        const getInitialSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await loadUserProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        };

        getInitialSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) =>{
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            
            if (currentUser) {
                await loadUserProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => {
            authListener?.subscription?.unsubscribe();
        };   
    }, []);
    
    const login = async (email, password) => {
        const data = await authService.login(email, password);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};