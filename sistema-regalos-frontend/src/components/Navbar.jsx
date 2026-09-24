import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, profile, logout } = useAuth();

  return (
    <header style={{
      backgroundColor: '#004A87', // Azul institucional San Joaquín
      color: '#FFFFFF',
      padding: '12px 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Sección Izquierda: Identidad Municipal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          color: '#004A87',
          fontWeight: 'bold',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          SJ
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            Municipalidad de San Joaquín
          </h1>
          <span style={{ fontSize: '12px', opacity: 0.85 }}>
            Sistema de Regalos Navideños
          </span>
        </div>
      </div>

      {/* Sección Derecha: Perfil de Usuario y Botón Cierre */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', fontSize: '14px' }}>
            <div style={{ fontWeight: '600' }}>
              {profile?.nombre_completo || user.email}
            </div>
            <div style={{ fontSize: '12px', color: '#E2E8F0' }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px'
              }}>
                {profile?.rol || 'Usuario'}
              </span>
              {profile?.territorios?.nombre && (
                <span style={{ marginLeft: '6px' }}>
                  • {profile.territorios.nombre}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              backgroundColor: '#E53E3E',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#C53030'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#E53E3E'}
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};