
import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) { 
    let numcreador = '573162402768';
    let ownerJid = numcreador + '@s.whatsapp.net';

    let name = await conn.getName(ownerJid) || 'Owner'; 
    let about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Creador de bots de WhatsApp y del Bot Mob Pysho Ai';
    let empresa = 'Bajo Bots- Servicios Tecnológicos';
    let imagen = 'https://files.catbox.moe/c2lp78.jpg'; // Reemplaza con la URL de la imagen que deseas mostrar

    // Enviar imagen junto con el número del dueño y sus detalles
    await conn.sendMessage(m.chat, { 
        image: { url: imagen },
        caption: `👤 *Dueño del bot*\n📌 *Nombre:* ${name}\n📞 *Número:* wa.me/${numcreador}\n📝 *Descripción:* ${about}\n🏢 *Empresa:* ${empresa}\n📧 *Email:* sebastianbarbaro82@gmail.com\n🌐 *Instagram:* https://www.instagram.com/kleinergp17?igsh=MWdodjdjY2w4eGZwcA==`,
    }, { quoted: m });
}

handler.help = ['owner']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;