let handler = async (m, { conn, text }) => {

if (text) {
global.db.data.chats[m.chat].emojiTag = text;
m.reply('𝙀𝙢𝙤𝙟𝙞𝙩𝙖𝙜 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤.');
} else {
m.reply('𝘼𝙜𝙧𝙚𝙜𝙖 𝙚𝙡 𝙀𝙢𝙤𝙟𝙞');
}

}
handler.command = ['emotag']
handler.help = ['emotag < emoji >']
handler.tags = ['group']
export default handler