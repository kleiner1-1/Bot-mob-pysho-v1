import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import nodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from "pino";
import { makeWASocket } from "../lib/simple.js";

const MAX_SUBBOTS = 100;
const jadi = "JADIBOT"; // Ajusta si tu carpeta de subbots tiene otro nombre

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Solo bot principal puede ejecutar
  if (conn.user.jid !== global.conn.user.jid) {
    return m.reply(`≡ 🍁 \`Este comando solo puede ser usado en el bot principal :\`\n\nwa.me/${global.conn.user.jid.split('@')[0]}?text=${usedPrefix}code`);
  }

  // Límite de subbots
  if ((global.conns?.length || 0) >= MAX_SUBBOTS) {
    return m.reply(`*≡ Lo siento, se ha alcanzado el límite de ${MAX_SUBBOTS} subbots. Por favor, intenta más tarde.*`);
  }

  let userName = m.sender.split("@")[0];
  let userFolder = `./${jadi}/${userName}`;
  if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

  // Borrar sesión si está corrupta
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
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ['Crow', 'Chrome', '2.0.0'],
    defaultQueryTimeoutMs: undefined,
    msgRetryCache: new nodeCache(),
  };

  let isPairing = args[0] && (args[0] === '--code' || args[0] === 'code' || command === 'code');

  let sock = makeWASocket(configBase);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, isNewLogin } = update;

    if (qr && !isPairing) {
      // Enviar QR como imagen
      await m.reply("✨ Escanea este código QR para conectarte como subbot.");
      await conn.sendFile(m.chat, await qrcode.toBuffer(qr, { scale: 8 }), "subbot-qr.png", "Escanea este QR con WhatsApp para ser SubBot.", m);
    }

    if (isPairing && isNewLogin) {
      // Enviar pairing code
      await m.reply("⚡ Solicitando el código para emparejar, espera unos segundos...");
      try {
        let code = await sock.requestPairingCode(userName);
        await m.reply(`🔑 *Tu código para ser SubBot es:*\n\n${code}\n\n> Ve a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`);
      } catch (e) {
        await m.reply("❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.");
      }
    }

    if (connection === "open") {
      await m.reply("✅ ¡SubBot conectado correctamente!");
      global.conns = global.conns || [];
      global.conns.push(sock);
    }

    if (connection === "close") {
      sock.ev.removeAllListeners();
    }
  });

  // Forzar pairing code sin QR si es necesario
  if (isPairing) {
    try {
      // Forzamos el ciclo de pairing code
      let code = await sock.requestPairingCode(userName);
      await m.reply(`🔑 *Tu código para ser SubBot es:*\n\n${code}\n\n> Ve a WhatsApp > Dispositivos vinculados > Vincular dispositivo > Ingresa el código.`);
    } catch (e) {
      await m.reply("❌ No se pudo generar el código de emparejamiento. Intenta de nuevo.");
    }
  }
};

handler.help = ["serbot", "serbot --code", "code"];
handler.tags = ["serbot"];
handler.command = ["serbot", "code"];

export default handler;