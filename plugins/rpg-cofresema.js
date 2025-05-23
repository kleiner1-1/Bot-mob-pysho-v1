
let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const now = new Date();

    // Inicializa las propiedades si no existen
    if (!user.walletSweets) user.walletSweets = 0;
    if (!user.walletXP) user.walletXP = 0;

    // Verifica si el usuario puede abrir la casa
    if (user.lastCasa && now - user.lastCasa < 1000) { // 1 segundo en milisegundos
        const timeLeft = Math.ceil((1000 - (now - user.lastCasa)) / 1000); // Tiempo restante en segundos
        return conn.reply(m.chat, `⏳ Debes esperar ${timeLeft} segundos antes de abrir la casa nuevamente.`, m);
    }

    // Actualiza la última vez que se abrió la casa
    user.lastCasa = now;

    // Añade las recompensas
    const recompensaDulces = 20;
    const recompensaXP = 20;

    // Sumar a la cartera
    user.walletSweets += recompensaDulces;
    user.walletXP += recompensaXP;

    // Mensaje de respuesta con un toque explosivo
    conn.reply(m.chat, `💥 ¡BOOM! Has abierto la casa y recibiste ${recompensaDulces} dulces y ${recompensaXP} XP! 💥 Ahora tienes un total de ${user.walletSweets} dulces y ${user.walletXP} XP en tu cartera. ¡Sigue así! 🎊`, m);
};

handler.help = ['abrircasa'];
handler.tags = ['economy'];
handler.command = ['abrircasa'];

export default handler;