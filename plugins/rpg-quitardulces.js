
const handler = async (m, { conn, args }) => {
    // Verificamos si se han proporcionado argumentos
    if (!args[0] || !args[1]) {
        return conn.sendMessage(m.chat, { text: "Por favor, usa el formato correcto: .quitardulces <cantidad> @usuario" }, { quoted: m });
    }

    const cantidad = parseInt(args[0]); // Convertimos la cantidad a número
    const usuarioID = args[1]; // ID del usuario al que le quieres quitar los dulces

    // Validamos la cantidad
    if (isNaN(cantidad) || cantidad <= 0) {
        return conn.sendMessage(m.chat, { text: "La cantidad debe ser un número positivo." }, { quoted: m });
    }

    // Obtenemos el usuario objetivo
    const targetUser = global.db.data.users[usuarioID];
    
    if (!targetUser) {
        return conn.sendMessage(m.chat, { text: "El usuario especificado no se encontró." }, { quoted: m });
    }

    // Verificamos si el usuario tiene suficientes dulces
    if (targetUser.dulce < cantidad) {
        return conn.sendMessage(m.chat, { text: "El usuario no tiene suficientes dulces para quitar." }, { quoted: m });
    }

    // Restamos la cantidad de dulces
    targetUser.dulce -= cantidad; 
    const message = `🚩 Se le han quitado ${cantidad} dulces a *@${usuarioID.split('@')[0]}*. Ahora tiene ${targetUser.dulce} dulces restantes.`;

    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [usuarioID] }, { quoted: m });
        console.log(`Se han quitado ${cantidad} dulces a ${usuarioID}`); 
    } catch (error) {
        console.error("Error al quitar los dulces:", error);
        await conn.sendMessage(m.chat, { text: "Hubo un error al intentar quitar los dulces. Intenta de nuevo más tarde." }, { quoted: m });
    }
};

handler.help = ['quitardulces <cantidad> <@usuario>'];
handler.tags = ['admin'];
handler.command = /^(quitardulces)$/i;
handler.admin = true; // Solo los administradores pueden usar este comando
handler.fail = null;

export default handler;