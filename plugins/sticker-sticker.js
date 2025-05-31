
import { sticker} from '../lib/sticker.js';
import { webp2png} from '../lib/webp2mp4.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const REDES = 'https://www.instagram.com/sebastian_barboza13?igsh=ZGsyNm9lNTBhcGp1';
const ICONS = null;

const handler = async (m, { conn}) => {
  try {
    let q = m.quoted? m.quoted: m;
    let mime = q.mimetype || q.mediaType || '';

    if (!/webp|image|video/g.test(mime)) {
      return m.reply('💫 Responde a una imagen para convertirla en sticker.');
}

    let media = await q.download?.();
    if (!media) return m.reply('⚡ No se pudo descargar el archivo.');

    if (/video/g.test(mime) && q.seconds> 8) {
      return m.reply('☁️ ¡El video no puede durar más de 8 segundos!');
}

    let stickerFile = await processSticker(media, mime);
    return sendSticker(m, conn, stickerFile);

} catch (e) {
    console.error(e);
    return m.reply('❌ Ocurrió un error al generar el sticker.');
}
};

const processSticker = async (media, mime) => {
  if (/webp/g.test(mime)) return await webp2png(media);
  if (/image/g.test(mime)) return await uploadImage(media);
  if (/video/g.test(mime)) return await uploadFile(media);
  return await uploadImage(media);
};

const sendSticker = (m, conn, stickerFile) => {
  conn.sendFile(m.chat, stickerFile, 'sticker.webp', '', m, true, {
    contextInfo: {
      forwardingScore: 200,
      isForwarded: false,
      externalAdReply: {
        showAdAttribution: false,
        title: 'MobPysho Bot 🤖',
        body: 'tu papi bajobots',
        mediaType: 2,
        sourceUrl: REDES,
        thumbnail: ICONS
}
}
}, { quoted: m});
};

handler.help = ['sticker (responde a una imagen)'];
handler.tags = ['herramientas'];
handler.command = ['s', 'sticker', 'stiker'];

export default handler;
