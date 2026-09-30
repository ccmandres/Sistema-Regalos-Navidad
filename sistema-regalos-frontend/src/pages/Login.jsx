import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Revisa correo y contraseña.');
    } finally {
      setCargando(false);
    }
  };
  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#004A87' }}>Ingreso al Sistema</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
          Municipalidad de San Joaquín
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FFF5F5',
          color: '#E53E3E',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '16px',
          borderLeft: '4px solid #E53E3E'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@sanjoaquin.cl"
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E0',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E0',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            backgroundColor: '#004A87',
            color: '#FFFFFF',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: cargando ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.7 : 1
          }}
        >
          {cargando ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};