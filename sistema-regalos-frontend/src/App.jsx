import { MainLayout } from './components/MainLayout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import VistaDirigente from './components/VistaDirigente'; // ¡Importamos la vista!

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
        Cargando sistema...
      </div>
    );
  }

  // Si no hay usuario, mostramos el Login
  if (!user) {
    return <Login />;
  }

  // Si el usuario inició sesión, verificamos su rol para mostrar la vista correcta
  return (
    <MainLayout>
      {profile?.rol === 'Dirigente de Junta de Vecinos' ? (
        // Si es dirigente, mostramos su vista con los botones y la tabla
        <VistaDirigente />
      ) : (
        // Si tiene otro rol (Administrador u Operador), mostramos el panel por defecto por ahora
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Panel Principal</h2>
          <p>
            ¡Hola <strong>{profile?.nombre_completo || user.email}</strong>! Has
            ingresado correctamente con el rol:{' '}
            <strong>{profile?.rol || 'Usuario'}</strong>.
          </p>
          <p className="text-gray-500 mt-4">
            (La vista para este rol aún está en construcción)
          </p>
        </div>
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}