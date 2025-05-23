
import { downloadContentFromMessage} from '@whiskeysockets/baileys';
import fs from 'fs';

const handler = async (m, { conn}) => {
    try {
        if (!m.quoted ||!m.quoted.mimetype ||!m.quoted.mimetype.startsWith('image/')) {
            return m.reply('❌ *Error:* Responde a una imagen con el comando `.setprofile` para cambiar la foto de perfil.');
}
        const mediaStream = await downloadContentFromMessage(m.quoted, 'image');
        let buffer = Buffer.from([]);

        for await (const chunk of mediaStream) {
            buffer = Buffer.concat([buffer, chunk])
{
        const path = './profile.jpg';
        fs.writeFileSync(path, buffer);
        await conn.updateProfilePicture(conn.user.id, { url: path});
        if (conn.authState.creds.me?.id) {
            await conn.updateProfilePicture(conn.authState.creds.me.id, { url: path});
}
        m.reply('✅ *¡Foto de perfil actualizada con éxito!* 😃📸');

} catch (error) {
        console.error(error);
        m.reply('⚠️ *Error:* No se pudo cambiar la foto de perfil. 🛑\n' + error.message);
}
};

handler.command = /^setprofile$/i;
handler.tags = ['info'];
export default handler;