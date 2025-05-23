
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) {
        return conn.reply(m.chat, '👑 El usuario no se encuentra en la base de Datos.', m);
    }
    if (user.health < 80) {
        return conn.reply(m.chat, '💔 No tienes suficiente salud para aventurarte. Usa el comando .heal para curarte.', m);
    }
    if (user.lastAdventure && new Date() - user.lastAdventure <= 1500000) {
        let timeLeft = 1500000 - (new Date() - user.lastAdventure);
        return conn.reply(m.chat, `⏳ Debés esperar ${msToTime(timeLeft)} antes de aventurarte de nuevo.`, m);
    }
    
    let kingdoms = [
        'Reino de Eldoria',
        'Reino de Drakonia',
        'Reino de Arkenland',
        'Reino de Valoria',
        'Reino de Mystara',
        'Reino de Ferelith',
        'Reino de Thaloria',
        'Reino de Nimboria',
        'Reino de Galadorn',
        'Reino de Elenaria'
    ];
    
    let randomKingdom = pickRandom(kingdoms);
    let coin = pickRandom([20, 5, 7, 8, 88, 40, 50, 70, 90, 999, 300]);
    let emerald = pickRandom([1, 5, 7, 8]);
    let iron = pickRandom([5, 6, 7, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
    let gold = pickRandom([20, 5, 7, 8, 88, 40, 50]);
    let coal = pickRandom([20, 5, 7, 8, 88, 40, 50, 80, 70, 60, 100]);
    let stone = pickRandom([200, 500, 700]);
    let diamonds = pickRandom([1, 2]);
    let exp = pickRandom([10, 20]);
    
    // Agregar dulces
    let candies = pickRandom([1,2 ,3 ,4 ,5]); // Puedes ajustar el rango según lo que necesites

    user.coin += coin;
    user.emerald += emerald;
    user.iron += iron;
    user.gold += gold;
    user.coal += coal;
    user.stone += stone;
    user.diamonds += diamonds;
    user.exp += exp;
    
    // Sumar los dulces a la cartera
    user.candies += candies; // Asegúrate que el atributo candies exista en tu base de datos
    
    user.health -= 50;
    
    if (user.health < 0) {
        user.health = 0;
    }
    
    // Definimos la variable moneda
    let moneda = 'monedas'; // O puedes usar el símbolo de la moneda que prefieras
    
    let info = `🛫 *Te has aventurado en el ${randomKingdom}*\n` +
               `🏞️ *Aventura Finalizada* 🏞️\n` +
               `💸 *${moneda} Ganados:* ${coin}\n` +
               `♦️ *Esmeralda:* ${emerald}\n` +
               `🔩 *Hierro:* ${iron}\n` +
               `🏅 *Oro:* ${gold}\n` +
               `🕋 *Carbón:* ${coal}\n` +
               `🪨 *Piedra:* ${stone}\n` +
               `💎 *Diamantes Ganados:* ${diamonds}\n` +
               `🍬 *Dulces Ganados:* ${candies}\n` + // Mostrar dulces ganados
               `✨ *Experiencia Ganada:* ${exp}\n` +
               `❤️ *Salud Actual:* ${user.health}`;
    
    await conn.sendMessage(m.chat,{ text: info }, { quoted: m });
};

handler.help = ['aventura', 'adventure'];
handler.tags = ['rpg'];
handler.command = ['adventure', 'aventura']
handler.cooldown =1500000;

export default handler;

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
   let minutes = Math.floor((duration / (1000 *60)) %60);
   let seconds = Math.floor((duration /1000) %60);
   return `${minutes} m y ${seconds} s`;
}