
export async function before(m, { conn, isOwner, isROwner }) {
    if (m.isBaileys && m.fromMe) return true;
    if (m.isGroup) return false;
    if (!m.message) return true;

    const botSettings = global.db.data.settings[this.user.jid] || {};
  
    if (botSettings.antiPrivate && !isOwner && !isROwner) {
        await m.reply(`🚨 *¡Atención @${m.sender.split`@`[0]}!*  
❌ *No está permitido enviar mensajes privados.*  
🚫 *Serás bloqueado automáticamente.*  
🔗 *Si necesitas ayuda, únete a nuestro grupo oficial:*  
👉 [Grupo Oficial](https://chat.whatsapp.com/G1XFpYDLN8aF3fpVUSD2uF)`, false, { mentions: [m.sender] });

        await conn.updateBlockStatus(m.chat, 'block');
        console.log(`Usuario ${m.sender} bloqueado por contacto privado.`);
    }

    return false;
}