
let handler = async (m, { conn, args }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Verificar que se haya proporcionado un argumento para el canje
    if (!args[0] || isNaN(args[0])) {
        return m.reply("⚠️ Por favor, indica la cantidad de caramelos que deseas canjear.");
    }

    let cantidadACanjear = parseInt(args[0]);

    // Verificar que el usuario tenga suficientes caramelos
    if (user.caramelos < cantidadACanjear) {
        return m.reply(`🚫 No tienes suficientes caramelos. Tienes ${user.caramelos} caramelos.`);
    }

    // Aquí puedes definir qué obtiene el usuario al canjear
    let premio = "un descuento especial"; // Cambia esto por lo que desees

    // Restar los caramelos del usuario
    user.caramelos -= cantidadACanjear;

    // Respuesta al usuario
    await m.reply(`✅ Has canjeado ${cantidadACanjear} caramelos y recibes ${premio}. Ahora tienes ${user.caramelos} caramelos.`);
}

handler.help = ['canjearcaramelos <cantidad>'];
handler.tags = ['economía'];
handler.command = ['canjearcaramelos'];

export default handler;