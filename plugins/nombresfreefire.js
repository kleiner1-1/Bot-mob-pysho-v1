const letras = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

const simbolos = [
  "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ";", ":", "<", ">", ",", ".", "/",
  "?", "~", "`", "¬", "£", "¤", "¥", "¦", "§", "¨", "ª", "«", "¬", "­", "®", "¯", "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "»", "¼", "½", "¾", "¿",
  "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß",
  "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ",
  "¡", "™", "‰", "‽", "⁂", "⁃", "⁄", "⁅", "⁆", "⁇", "⁈", "⁉", "⁊", "⁋", "⁌", "⁍", "⁎", "⁏", "⁐", "⁑", "⁒", "⁓", "⁔", "⁕", "⁖", "⁗", "⁘", "⁙", "⁚", "⁛", "⁜", "⁝", "⁞"
];

const estilos = [
  "normal",
  "negrita",
  "cursiva",
  "subrayado",
  "tachado",
  "mayúsculas",
  "minúsculas",
  "invertido"
];

const usuariosRegistrados = [
  // Aquí debes agregar los usuarios registrados en tu base de datos
  // por ejemplo:
  { id: 1, nombre: "usuario1" },
  { id: 2, nombre: "usuario2" }
];

const gruposPermitidos = [
  // Aquí debes agregar los IDs de los grupos permitidos
  // por ejemplo:
  "grupo1",
  "grupo2"
];

function estaRegistrado(usuario) {
  return usuariosRegistrados.some(u => u.nombre === usuario);
}

function esGrupoPermitido(idGrupo) {
  return gruposPermitidos.includes(idGrupo);
}

function nombrefreefire(usuario, idGrupo) {
  if (!esGrupoPermitido(idGrupo)) {
    return "Esta función solo está disponible en grupos permitidos.";
  }

  if (!estaRegistrado(usuario)) {
    return "Debes estar registrado para usar esta función.";
  }

  const nombre = [];
  const longitud = Math.floor(Math.random() * 10) + 5;
  for (let i = 0; i < longitud; i++) {
    const tipo = Math.floor(Math.random() * 3);
    if (tipo === 0) {
      nombre.push(letras[Math.floor(Math.random() * letras.length)]);
    } else if (tipo === 1) {
      nombre.push(simbolos[Math.floor(Math.random() * simbolos