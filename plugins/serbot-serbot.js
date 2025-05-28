import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';
import fs from 'fs';
import pino from 'pino';
import nodeCache from 'node-cache';
import { makeWASocket } from '../lib/simple.js';

const MAX_SUBBOTS = 100;
const jadi = 'JADIBOT';

let handler = async (m, { conn, args, usedPrefix, command }) => {
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
  if (fs.existsSync(`${userFolder}/creds.json`)) {
    try {
      const creds = JSON.parse(fs.readFileSync(`${userFolder}/creds.json`));
      if (creds && creds.registered === false) fs.unlinkSync(`${userFolder}/creds.json`);
    } catch {
      fs.unlinkSync(`${userFolder}/creds.json`);
    }
  }
  const { state } = await useMultiFileAuthState(userFolder);
  const configBase = {
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: ['Crow', 'Chrome', '2.0.0'],
    defaultQueryTimeoutMs: undefined,
    version: [2, 3000, 1023223821],
    msgRetryCache: new nodeCache(),
    syncFullHistory: true,
  };
  let isPairing = args[0] && (args[0] === '--code' || args[0] === 'code' || command === 'code');
  let sent = false;
  let sock = makeWASocket(configBase);
  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, isNewLogin } = update;
    if (qr && !isPairing && !sent) {
      sent = true;
      await m.reply('✨ Escanea este código QR para conectarte como subbot.');
      await conn.sendFile(m.chat, await qrcode.toBuffer(qr, { scale: 8 }), 'subbot-qr.png', 'Escanea este QR con WhatsApp para ser SubBot.', m);
    }
    if (isPairing && isNewLogin && !sent) {
      sent = true;
      try {
        let code = await sock.requestPairingCode(userName);
        await m.reply(`🔑 *Tu código para ser SubBot es:*\n\n${code}\n\nVe a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`);
      } catch {
        await m.reply('❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.');
      }
    }
    if (connection === 'open') {
      await m.reply('✅ ¡SubBot vinculado y conectado correctamente!');
      global.conns.push(sock);
    }
    if (connection === 'close') {
      try { sock.ev.removeAllListeners(); } catch {}
      let idx = global.conns.indexOf(sock);
      if (idx !== -1) global.conns.splice(idx, 1);
    }
  });
  if (isPairing && !sent) {
    try {
      let code = await sock.requestPairingCode(userName);
      await m.reply(`🔑 *Tu código para ser SubBot es:*\n\n${code}\n\nVe a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`);
    } catch {
      await m.reply('❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.');
    }
  }
};

handler.help = ['serbot', 'serbot --code', 'code'];
handler.tags = ['serbot'];
handler.command = ['serbot', 'code'];

export default handler;