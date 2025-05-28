import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';
import fs from 'fs';
import pino from 'pino';
import nodeCache from 'node-cache';
import { makeWASocket } from '../lib/simple.js';

const MAX_SUBBOTS = 100;
const jadi = 'JADIBOT'; // Cambia esto si tu carpeta de subbots se llama diferente

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Sólo el bot principal puede ejecutar
  if (conn.user.jid !== global.conn.user.jid) {
    return m.reply(`≡ 🍁 \`Este comando solo puede ser usado en el bot principal :\`\n\nwa.me/${global.conn.user.jid.split('@')[0]}?text=${usedPrefix}code`);
  }

  global.conns = global.conns || [];
  if (global.conns.length >= MAX_SUBBOTS) {
    return m.reply(`*≡ Lo siento, se ha alcanzado el límite de ${MAX_SUBBOTS} subbots. Por favor, intenta más tarde.*`);
  }

  let userName = m.sender.split('@')[0];
  let userFolder = `./${jadi}/${userName}`;
  if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

  // Elimina sesión corrupta si la hay
  if (fs.existsSync(`${userFolder}/creds.json`)) {
    try {
      const creds = JSON.parse(fs.readFileSync(`${userFolder}/creds.json`));
      if (creds && creds.registered === false) fs.unlinkSync(`${userFolder}/creds.json`);
    } catch {
      fs.unlinkSync(`${userFolder}/creds.json`);
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(userFolder);
  const { version } = await fetchLatestBaileysVersion();
  const configBase = {
    version,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: ['Crow', 'Chrome', '2.0.0'],
    defaultQueryTimeoutMs: undefined,
    msgRetryCache: new nodeCache(),
    syncFullHistory: true,
  };

  let isPairing = args[0] && (args[0] === '--code' || args[0] === 'code' || command === 'code');
  let sent = false;

  let sock = makeWASocket(configBase);
  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, isNewLogin } = update;

    // QR para escanear
    if (qr && !isPairing && !sent) {
      sent = true;
      await m.reply('✨ Escanea este código QR para conectarte como subbot.');
      await conn.sendFile(m.chat, await qrcode.toBuffer(qr, { scale: 8 }), 'subbot-qr.png', 'Escanea este QR con WhatsApp para ser SubBot.', m);
    }

    // Pairing code
    if (isPairing && isNewLogin && !sent) {
      sent = true;
      try {
        let code = await sock.requestPairingCode(userName);
        await m.reply(
          `🔑 *Tu código para ser SubBot es:*\n\n${code}\n\nVe a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`
        );
      } catch (e) {
        await m.reply('❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.');
      }
    }

    // Confirmación de vinculación
    if (connection === 'open') {
      await m.reply('✅ ¡SubBot vinculado y conectado correctamente!');
      global.conns.push(sock);
    }

    // Limpieza en desconexión
    if (connection === 'close') {
      try { sock.ev.removeAllListeners(); } catch {}
      let idx = global.conns.indexOf(sock);
      if (idx !== -1) global.conns.splice(idx, 1);
    }
  });

  // Si es pairing code, lo solicita explícitamente (para algunos servidores Baileys es necesario forzarlo)
  if (isPairing && !sent) {
    try {
      let code = await sock.requestPairingCode(userName);
      await m.reply(
        `🔑 *Tu código para ser SubBot es:*\n\n${code}\n\nVe a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`
      );
    } catch (e) {
      await m.reply('❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.');
    }
  }
};

handler.help = ['serbot', 'serbot --code', 'code'];
handler.tags = ['serbot'];
handler.command = ['serbot', 'code'];

export default handler;