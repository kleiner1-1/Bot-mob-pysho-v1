
import db from '../lib/database.js';

let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Verificar si el usuario ya existe en la base de datos
    if (!user) {
        // Inicializar la experiencia del usuario si no existe
        user = {
            experience: 0 // Inicializa la experiencia a 0
        };
        users[m.sender] = user; // Guardamos el nuevo usuario en la base de datos
    }

    // Define la cantidad de experiencia que se ganará
    let experienciaGanada = 100; // Puedes cambiar este valor

    // Aumenta la experiencia del usuario
    user.experience += experienciaGanada;

    // Respuesta al usuario
    await m.reply(`🎉 Has ganado *${experienciaGanada}* puntos de experiencia! Ahora tienes *${user.experience}* puntos de experiencia.`);
};

handler.help = ['claim2'];
handler.tags = ['rpg'];
handler.command = ['claim2'];

export default handler;