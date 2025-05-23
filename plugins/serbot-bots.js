import ws from 'ws';

async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map();

  global.conns.forEach((conn) => {
    if (
      conn &&
      conn.user &&
      conn.ws &&
      conn.ws.socket &&
      conn.ws.socket.readyState !== ws.CLOSED
    ) {
      // Guardar la fecha de conexión si no está guardada
      if (!conn.user.connectedAt) {
        conn.user.connectedAt = Date.now();
      }

      if (!global.db.data.settings[conn.user.jid]) global.db.data.settings[conn.user.jid] = {};
      global.db.data.settings[conn.user.jid].modoSubbot = true;

      uniqueUsers.set(conn.user.jid, conn);
    }
  });

  let users = [...uniqueUsers.values()];

  let message = users
    .map((v, index) => {
      let jid = v.user?.jid || '-';
      let name = v.user?.name || '-';

      // Calcular tiempo conectado
      let timeConnected = Math.floor((Date.now() - v.user.connectedAt) / 1000); // en segundos
      let hours = Math.floor(timeConnected / 3600);
      let minutes = Math.floor((timeConnected % 3600) / 60);
      let seconds = timeConnected % 60;

      return `*${index + 1}.-* @${jid.replace(/[^0-9]/g, '')}\n*Link:* https://wa.me/${jid.replace(/[^0-9]/g, '')}\n*Nombre:* ${name}\n*Tiempo Conectado:* ${hours}h ${minutes}m ${seconds}s`;
    })
    .join('\n\n');

  let replyMessage = message.length === 0 ? '' : message;
  let totalUsers = users.length;
  let responseMessage = `*Total de Bots*: ${totalUsers || '0'}\n\n${replyMessage.trim()}`;

  await stars.sendMessage(
    m.chat,
    { text: responseMessage, mentions: stars.parseMention(responseMessage) },
    { quoted: m, rcanal }
  );
}

handler.command = ['listjadibot', 'bots'];
handler.help = ['bots'];
handler.tags = ['serbot'];
export default handler;
