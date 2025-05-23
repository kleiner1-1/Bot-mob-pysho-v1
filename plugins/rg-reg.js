
import { createHash } from 'crypto';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let channelID = '120363419009027760@newsletter'; // ID del canal donde se enviará la notificación
    let regFormat = /\|?(.*)([.|] *?)([0-9]*)$/i;

    // Validar si el usuario ya está registrado
    if (user.registered) {
        return m.reply(`✅ Ya estás registrado.\n\nSi deseas registrarte nuevamente, elimina tu registro actual usando el comando:\n*${usedPrefix}unreg*`);
    }

    // Validar formato del comando
    if (!regFormat.test(text)) {
        return m.reply(`❌ Formato incorrecto.\n\nUsa el comando así: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} Barboza.18*`);
    }

    let [_, name, splitter, age] = text.match(regFormat);
    if (!name || !age) return m.reply('❌ El nombre y la edad son obligatorios.');
    if (name.length > 50) return m.reply('❌ El nombre no puede exceder los 50 caracteres.');

    age = parseInt(age);
    if (isNaN(age) || age < 5 || age > 100) return m.reply('❌ La edad ingresada no es válida.');

    // Asignar datos al usuario
    user.name = name.trim();
    user.age = age;
    user.registered = true;
    user.regTime = +new Date();

    // Generar un hash único para el usuario
    let userHash = createHash('md5').update(m.sender).digest('hex');

    // Confirmación al usuario registrado
    let confirmMessage = `🎉 *¡Registro exitoso!*\n\n📂 Información registrada:\n👤 *Usuario:* ${name}\n🎂 *Edad:* ${age} años\n✅ *Estado:* Verificado\n\nUsa *#perfil* para ver tus detalles.`;

    await conn.sendMessage(m.chat, {
        text: confirmMessage,
        contextInfo: {
            externalAdReply: {
                title: '✅ Registro completado',
                body: 'Gracias por registrarte.',
                thumbnailUrl: 'https://files.catbox.moe/3mia0l.jpg', // Imagen proporcionada
                sourceUrl: 'https://your-website.com', // Personaliza con tu enlace
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    // Enviar notificación al canal
    let notificationMessage = `📥 *Nuevo usuario registrado:*\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *Registro Hash:* ${userHash}\n✅ *Estado:* Verificado`;
    await conn.sendMessage(channelID, {
        text: notificationMessage,
        contextInfo: {
            externalAdReply: {
                title: '🔔 Nuevo registro',
                body: `Usuario ${name} ha sido registrado con éxito.`,
                thumbnailUrl: 'https://files.catbox.moe/3mia0l.jpg', // Imagen proporcionada
                sourceUrl: 'https://your-website.com', // Personaliza con tu enlace
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
};

handler.help = ['reg'];
handler.tags = ['register'];
handler.command = ['reg', 'register', 'verificar', 'verify']; // Alias del comando

export default handler;
