
let handler = async (m) => {
    let user = global.db.data.users[m.sender];

    // Simular la excavación
    await m.reply(`${user.nombre}, ¡has comenzado a excavar! ⛏️`);

    // Dar la recompensa
    user.dulces += 100; // Aumentar los dulces en 100

    await m.reply(`🎉 ¡Felicidades! Has encontrado *100 dulces* al excavar.`);
}

handler.help = ['excavar']
handler.tags = ['mascota']
handler.command = ['dig', 'excavar']
handler.register = true 
export default handler;
