// ====================
// DEFINICIONES INICIALES
// ====================

// Texto para externalAdReply
const wm = "Mi Watermark";

// Variables utilizadas para generar la sourceUrl en externalAdReply
const nna = "https://ejemplo.com/nna.jpg";
const nna2 = "https://ejemplo.com/nna2.jpg";
const nn = "https://ejemplo.com/nn.jpg";
const md = "https://ejemplo.com/md.jpg";
const yt = "https://youtube.com/c/ejemplo";
const tiktok = "https://tiktok.com/@ejemplo";

// Valor para la función fakeReply (ajústalo según tu lógica)
const fake = false;

// Extensión del prototipo Array para obtener un elemento aleatorio
Array.prototype.getRandom = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Inicialización de la base de datos global si no existe
global.db = global.db || { data: { users: {}, tempCharacter: {} } };

// ====================
// VARIABLES Y ARREGLOS
// ====================

// Aquí se almacenarán los personajes "comprados"
const claimedCharacters = [];

// Lista de personajes predefinidos
const mainCharacters = [
  { name: "Naruto Uzumaki", url: "https://i.ibb.co/MygvfhNp/file.jpg", price: 100, claimedBy: null },
  { name: "Sakura Haruno", url: "https://i.ibb.co/MygvfhNp/file.jpg", price: 120, claimedBy: null },
  { name: "Sasuke Uchiha", url: "https://i.ibb.co/MygvfhNp/file.jpg", price: 150, claimedBy: null }
];

// ====================
// FUNCIONES AUXILIARES
// ====================

// Función para sincronizar personajes (añade personajes que aún no hayan sido "comprados")
function syncCharacters() {
  const newCharacters = mainCharacters.filter(mainChar =>
    !claimedCharacters.some(claimedChar => claimedChar.url === mainChar.url)
  );

  if (newCharacters.length > 0) {
    claimedCharacters.push(...newCharacters);
    console.log(`${newCharacters.length} personaje(s) agregado(s) a "claimed".`);
  }
  return claimedCharacters;
}

// Función para convertir milisegundos a formato "min seg"
function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  return `${minutes} min ${seconds} seg`;
}

// ====================
// HANDLER PRINCIPAL
// ====================

async function handler(m, { conn }) {
  // Aseguramos que el usuario esté inicializado en la base de datos
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { exp: 0, timeRy: 0 };
  }

  // Determinamos el destinatario para obtener la foto de perfil
  let who = (m.mentionedJid && m.mentionedJid[0])
    ? m.mentionedJid[0]
    : (m.fromMe ? conn.user.jid : m.sender);
  let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://example.com/default-profile.jpg');

  // Sincronizamos la lista de personajes
  const availableCharacters = syncCharacters();

  // Control de cooldown: 5 minutos (300000 milisegundos)
  let userTime = global.db.data.users[m.sender].timeRy;
  let cooldown = 300000;
  let nextAvailable = userTime + cooldown;
  if (new Date() - userTime < cooldown) {
    return conn.fakeReply(
      m.chat,
      `Espera ${msToTime(nextAvailable - new Date())} antes de usar este comando de nuevo`,
      m.sender,
      `No hagas spam`,
      'status@broadcast',
      null,
      fake
    );
  }

  // Verificamos que existan personajes disponibles
  if (!availableCharacters || availableCharacters.length === 0) {
    return await conn.sendMessage(
      m.chat,
      { text: '⚠️ No hay personajes disponibles en este momento.' },
      { quoted: m }
    );
  }

  // Seleccionamos un personaje aleatorio
  const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
  const status = randomCharacter.claimedBy
    ? `🔒 Estado: Comprado por @${randomCharacter.claimedBy.split('@')[0]}`
    : `🆓 Estado: Libre`;

  // Enviamos el personaje con su información y configuramos el externalAdReply
  const sentMessage = await conn.sendFile(
    m.chat,
    randomCharacter.url,
    'lp.jpg',
    `💥 Nombre: ${randomCharacter.name}\n💰 Precio: ${randomCharacter.price} exp\n${status}\n\n> Responde con "c" para comprarlo`,
    m,
    false,
    {
      contextInfo: {
        mentionedJid: randomCharacter.claimedBy ? [randomCharacter.claimedBy] : [],
        externalAdReply: {
          title: "✨️ Character Details ✨️",
          body: wm,
          thumbnailUrl: pp,
          sourceUrl: [nna, nna2, nn, md, yt, tiktok].getRandom(),
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false
        }
      }
    }
  );

  // Actualizamos el tiempo de uso para el usuario
  global.db.data.users[m.sender].timeRy = new Date().getTime();

  // Almacenamos temporalmente el personaje enviado para verificar la respuesta
  global.db.data.tempCharacter = { ...randomCharacter, messageId: sentMessage.id };
}

// ====================
// HANDLER ANTES DE RESPONDER
// ====================

handler.before = async (m, { conn }) => {
  const character = global.db.data.tempCharacter;

  // Se verifica que el mensaje citado y el texto 'c' coincidan con el personaje enviado
  if (m.quoted && m.text.toLowerCase() === 'c' && character && character.messageId === m.quoted.id) {
    const user = global.db.data.users[m.sender];
    const claimedCharacter = claimedCharacters.find(c => c.url === character.url);

    // Si el personaje ya fue comprado, se informa al usuario
    if (claimedCharacter.claimedBy) {
      return await conn.sendMessage(
        m.chat,
        {
          text: `❌ Este personaje ya ha sido comprado por @${claimedCharacter.claimedBy.split('@')[0]}`,
          contextInfo: { mentionedJid: [claimedCharacter.claimedBy] }
        },
        { quoted: m }
      );
    }

    // Verificamos si el usuario tiene suficiente exp para comprar
    if (user.exp < character.price) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ No tienes suficientes exp para comprar este personaje.' },
        { quoted: m }
      );
    }

    // Realizamos la compra: descontamos exp y asignamos el personaje al usuario
    user.exp -= character.price;
    claimedCharacter.claimedBy = m.sender;
    await conn.sendMessage(
      m.chat,
      { text: `🎉 ¡Has comprado a ${character.name} por ${character.price} exp!`, image: { url: character.url } },
      { quoted: m }
    );

    // Se elimina el personaje temporal para evitar reuso
    delete global.db.data.tempCharacter;
  }
};

// ====================
// CONFIGURACIÓN DEL HANDLER
// ====================

handler.help = ['rf', 'rm'];
handler.tags = ['econ'];
handler.command = ['rf', 'rm'];
handler.register = true;

export default handler;