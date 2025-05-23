
let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Obtener la fecha actual
    let today = new Date().toDateString();

    // Verificar si el usuario ya reclamó sus monedas hoy
    if (user.lastClaimedMonedas === today) {
        return m.reply("🚫 Ya has reclamado tus monedas hoy. Vuelve mañana para recibir más.");
    }

    // Cantidad de monedas a ganar
    let monedasGanadas = 15; // Puedes cambiar esta cantidad

    // Sumar las monedas ganadas al usuario
    user.monedas = (user.monedas || 0) + monedasGanadas;

    // Actualizar la fecha de la última reclamación
    user.lastClaimedMonedas = today;

    // Respuesta al usuario
    await m.reply(`✅ Has ganado ${monedasGanadas} monedas. Ahora tienes ${user.monedas} monedas.`);
}

handler.help = ['ganarmonedas'];
handler.tags = ['economía'];
handler.command = ['ganarmonedas'];

export default handler;