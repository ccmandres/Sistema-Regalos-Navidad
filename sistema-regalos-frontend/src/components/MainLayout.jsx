import { Navbar } from './Navbar';

export const MainLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7FAFC' }}>
      {/* Barra Superior */}
      <Navbar />

      {/* Contenido Dinámico de la Pantalla */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </main>

      {/* Pie de Página Municipal */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '12px',
        color: '#718096',
        borderTop: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF'
      }}>
        © 2026 Municipalidad de San Joaquín — Dirección de Desarrollo Comunitario (DIDECO)
      </footer>
    </div>
  );
};