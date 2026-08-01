// v1: formato de fecha con bug -> getMonth() devuelve 0-11, falta sumar 1
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth(); // BUG: falta +1, diciembre (11) se muestra como mes 11 en vez de 12
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = { formatDate };
