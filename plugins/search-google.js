
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '❌ Por favor, ingresa un término de búsqueda.\nEjemplo: .google Microsoft Copilot', m);
  }

  const query = args.join(' ');
  const apiUrl = `https://api.vreden.my.id/api/google?query=${encodeURIComponent(query)}`;

  try {
    await m.react('⏳'); // Reacción de "procesando"

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.results || data.results.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron resultados. Intenta con otra búsqueda.', m);
    }

    let results = `🔎 *Resultados de Google para:* ${query}\n\n`;
    data.results.forEach((item, index) => {
      results += `➤ *${index + 1}:* [${item.title}](${item.link})\n`;
    });

    await conn.reply(m.chat, results.trim(), m);
    await m.react('✅'); // Reacción de éxito
  } catch (error) {
    console.error('Error al procesar la búsqueda:', error);
    await m.react('❌'); // Reacción de error
    conn.reply(m.chat, `❌ Ocurrió un error al realizar la búsqueda: ${error.message}`, m);
  }
};

handler.command = ['google'];
handler.help = ['google <término>'];
handler.tags = ['search'];

export default handler;