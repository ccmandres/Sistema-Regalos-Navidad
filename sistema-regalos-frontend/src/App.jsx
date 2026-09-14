// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { beneficiariosService } from './services/beneficiariosService';

function App() {
  const { user, profile, loading } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // Probar la lectura de beneficiarios
  useEffect(() => {
    const probarServicio = async () => {
      setCargandoDatos(true);
      try {
        const datos = await beneficiariosService.getBeneficiarios();
        setBeneficiarios(datos);
        setErrorMensaje(null);
      } catch (err) {
        console.error('Error al probar servicio:', err);
        setErrorMensaje(err.message);
      } finally {
        setCargandoDatos(false);
      }
    };

    if (!loading) {
      probarServicio();
    }
  }, [loading]);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Municipalidad de San Joaquín</h2>
      <h3>Prueba de Servicio de Beneficiarios (Sprint 1)</h3>
      <hr />

      {/* Estado de Autenticación */}
      <div style={{ background: user ? '#e6fffa' : '#fff5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ margin: 0 }}>
          <strong>Estado Sesión:</strong> {loading ? 'Cargando...' : user ? `✅ Conectado (${user.email})` : '🔒 Sin sesión activa'}
        </p>
        {profile && <p style={{ margin: '5px 0 0 0' }}><strong>Rol:</strong> {profile.rol}</p>}
      </div>

      {/* Estado de la Base de Datos */}
      <h4>Lectura de Tabla 'beneficiarios':</h4>
      {cargandoDatos ? (
        <p>⏳ Consultando Supabase...</p>
      ) : errorMensaje ? (
        <p style={{ color: 'red', background: '#ffe3e3', padding: '10px', borderRadius: '5px' }}>
          ❌ {errorMensaje}
        </p>
      ) : (
        <div>
          <p style={{ color: 'green' }}>
            ✅ Conexión exitosa a Supabase. Se encontraron <strong>{beneficiarios.length}</strong> beneficiario(s).
          </p>
          {beneficiarios.length > 0 && (
            <ul style={{ background: '#f7fafc', padding: '15px 30px', borderRadius: '8px' }}>
              {beneficiarios.map((b) => (
                <li key={b.id}>
                  <strong>{b.nombre_completo}</strong> - RUT: {b.rut_menor} ({b.rango_etario})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;