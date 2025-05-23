
let handler = async (m, { isPrems, conn }) => {
    // Asegúrate de que lastcofre esté definido
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
        global.db.data.users[m.sender].lastcofre = 0; // Inicializa lastcofre si no existe
    }

    let time = global.db.data.users[m.sender].lastcofre + 0; // 36000000 10 Horas //86400000 24 Horas

    if (new Date() - global.db.data.users[m.sender].lastcofre < 0) {
        throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁`;
    }

    let img = 'https://qu.ax/qmaUp.jpg'; 
    let texto = `» 𝙈𝘼𝙋𝘼 𝘿𝙀 𝙆𝘼𝙇𝘼𝙃𝘼𝙍𝙄 𝙁𝙍𝙀𝙀 𝙁𝙄𝙍𝙀 ✅`;

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    await conn.sendFile(m.chat, img, 'hades.jpg', texto, fkontak);
    global.db.data.users[m.sender].lastcofre = new Date().getTime(); // Actualiza lastcofre
}

handler.help = ['kalahari'];
handler.tags = ['freefire'];
handler.command = ['kalahari']; 
handler.register = true;
handler.admin = true;

export default handler;