// Calcula el Dígito Verificador usando Módulo 11
export function calcularDigitoVerificador(rutSinDv) {
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutSinDv.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDv.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const resultado = 11 - resto;

  if (resultado === 11) return '0';
  if (resultado === 10) return 'K';
  return resultado.toString();
}

// Limpia y da formato automático (Ej: "123456789" -> "12.345.678-9")
export function formatearRut(rutCompleto) {
  if (!rutCompleto) return '';

  const limpiar = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpiar.length < 2) return limpiar;

  const cuerpo = limpiar.slice(0, -1);
  const dvIngresado = limpiar.slice(-1);

  let formato = '';
  for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
    formato = cuerpo.charAt(i) + (j > 0 && j % 3 === 0 ? '.' : '') + formato;
  }

  return `${formato}-${dvIngresado}`;
}

// Valida si el RUT completo es matemáticamente correcto por Módulo 11
export function validarRut(rutCompleto) {
  if (!rutCompleto) return false;
  const limpiar = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpiar.length < 8) return false;

  const cuerpo = limpiar.slice(0, -1);
  const dv = limpiar.slice(-1);

  return calcularDigitoVerificador(cuerpo) === dv;
}