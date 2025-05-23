
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply('🚩 Por favor, proporciona un texto para generar el video.\n_Ejemplo: .bratvid Hola mundo_');
  }

  const text = args.join(' ');
  const apiUrl = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;

  try {
    m.reply('⏳ Generando tu video, por favor espera un momento...');

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error al generar el video: ${response.statusText}`);

    const buffer = await response.buffer();

    await conn.sendFile(m.chat, buffer, 'bratvid.mp4', `🎥 *Video generado para:* _${text}_`, m);
  } catch (error) {
    console.error('Error al generar el video:', error);
    m.reply('🚩 Ocurrió un error al generar el video. Por favor, intenta nuevamente más tarde.');
  }
};

handler.command = ['bratvid', 'vidbrat'];
export default handler;