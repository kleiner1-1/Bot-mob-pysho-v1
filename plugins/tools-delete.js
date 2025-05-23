let handler = async (m, { command }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");

    // Reiniciar valores del usuario
    global.db.data.users[m.sender] = {
        ...user, // Mantiene otros datos si los hay
        diamantes: 0,
        dulces: 0,
        xp: 0,
        mascota: null
    };

    return m.reply("🗑️ *Se han eliminado tus datos correctamente:*\n💎 Diamantes: 0\n🍬 Dulces: 0\n🎖️ XP: 0\n🐾 Mascota: Ninguna");
};

handler.command = /^delete$/i;
export default handler;