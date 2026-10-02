import { MainLayout } from './components/MainLayout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import VistaDirigente from './components/VistaDirigente';
import VistaAdmin from './components/VistaAdmin';
// import VistaOperador from './components/VistaOperador';

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A87]"></div>
      </div>
    );
  }

  // Si no hay sesión activa, redirige o muestra el Login obligatoriamente
  if (!user) {
    return <Login />;
  }

  // Guardián basado en el rol obtenido de la tabla 'perfiles' de Supabase
  const renderizarVistaPorRol = () => {
    const rol = profile?.rol;

    switch (rol) {
      case 'Dirigente de Junta de Vecinos':
        return <VistaDirigente />;
        
      case 'Administrador Municipal':
        return <VistaAdmin />;
        
      case 'Operador':
        // return <VistaOperador />; // Descomentar cuando crees la vista del operador
        return <VistaPlaceholder rol="Operador" usuario={profile?.nombre_completo || user.email} />;
        
      default:
        return (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-700 max-w-lg mx-auto mt-10">
            <h3 className="font-bold text-lg">Acceso Restringido</h3>
            <p className="mt-1 text-sm">Tu cuenta no tiene un rol asignado válido en el sistema. Contacta al Administrador Municipal.</p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      {renderizarVistaPorRol()}
    </MainLayout>
  );
}

// Componente temporal para roles en desarrollo
function VistaPlaceholder({ rol, usuario }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-extrabold text-gray-900">Panel de {rol}</h2>
      <p className="text-gray-600 mt-2">
        ¡Hola, <strong>{usuario}</strong>! Has ingresado con éxito.
      </p>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
        🛠️ Este módulo se encuentra planificado en el siguiente sprint de desarrollo.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}