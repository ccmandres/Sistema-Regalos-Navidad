import { MainLayout } from './components/MainLayout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';


function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
        Cargando sistema...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <MainLayout>
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
      </div>
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