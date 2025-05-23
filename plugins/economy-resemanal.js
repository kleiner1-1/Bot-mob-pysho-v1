const cooldownTime = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
const recompensaXP = 10000;
const recompensaDulces = 10000;

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (!user) throw '🚩 No estás registrado en mi base de datos.';

    let lastClaim = user.lastResemanal || 0;
    let now = Date.now();

    if (now - lastClaim < cooldownTime) {
        let tiempoRestante = cooldownTime - (now - lastClaim);
        let dias = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
        let horas = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        let minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        
        throw `🚩 Ya reclamaste tu recompensa semanal. Vuelve en *${dias} días, ${horas} horas y ${minutos} minutos*.`;
    }

    user.exp += recompensaXP;
    user.limit += recompensaDulces;
    user.lastResemanal = now;

    await m.reply(`🎉 ¡Felicidades! Has reclamado tu recompensa semanal.  
🆙 *+${recompensaXP}* XP  
🍬 *+${recompensaDulces}* Dulces  

📌 Podrás reclamar nuevamente en *7 días*.`);
};

handler.help = ['resemanal'];
handler.tags = ['rpg'];
handler.command = ['resemanal'];

export default handler;