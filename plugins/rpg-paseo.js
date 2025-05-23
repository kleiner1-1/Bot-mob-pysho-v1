let handler = async (m, { conn, command }) => {
    let user = global.db.data.users[m.sender];
    if (!user.mascota) return m.reply("❌ No tienes una mascota. Usa *.comprarmascota* para adoptar una.");

    let acciones = {
        agua: {
            mensajes: [
                "🚰 Tu mascota tomó agua 💧 y se siente refrescada.",
                "💦 Tu mascota bebió agua y ahora está llena de energía.",
                "🌊 Tu mascota jugó con el agua antes de beberla, ¡qué divertido!",
                "🏞️ Encontraste un río y tu mascota disfrutó bebiendo agua fresca.",
                "🥤 Tu mascota tomó agua en su tazón favorito, ¡le encantó!"
            ],
            emoji: "💧"
        },
        pasear: {
            mensajes: [
                "🚶‍♂️ Paseaste con tu mascota 🐾 y se siente más feliz.",
                "🌳 Disfrutaste de una caminata con tu mascota en el parque.",
                "🏃‍♀️ Corriste con tu mascota y ambos están llenos de energía.",
                "🐕 Tu mascota encontró nuevos amigos durante el paseo.",
                "🛤️ Exploraste un nuevo sendero con tu mascota, ¡qué aventura!"
            ],
            emoji: "😊"
        },
        viajar: {
            mensajes: [
                "✈️ Tu mascota y tú hicieron un viaje 🌍. ¡Qué aventura!",
                "🚗 Viajaste con tu mascota a la playa 🏖️ y jugaron en la arena.",
                "🚂 Tu mascota disfrutó de un viaje en tren, viendo el paisaje pasar.",
                "🗻 Viajaste a las montañas con tu mascota y disfrutaron del aire puro.",
                "🌆 Tu mascota conoció una nueva ciudad y exploraron juntos."
            ],
            emoji: "🗺️"
        },
        acariciar: {
            mensajes: [
                "💖 Acariciaste a tu mascota y se siente querida.",
                "😽 Tu mascota ronronea mientras la acaricias, ¡qué ternura!",
                "🐾 Tu mascota se acurrucó a tu lado mientras la acariciabas.",
                "💞 Disfrutaste de un momento especial con tu mascota.",
                "🛏️ Tu mascota se quedó dormida mientras la acariciabas."
            ],
            emoji: "💕"
        }
    };

    let premios = [
        { tipo: 'xp', cantidad: Math.floor(Math.random() * 200) + 50 },
        { tipo: 'dulces', cantidad: Math.floor(Math.random() * 5) + 1 },
        { tipo: 'comida', cantidad: Math.floor(Math.random() * 3) + 1 }
    ];

    let premio = premios[Math.floor(Math.random() * premios.length)];
    user[premio.tipo] = (user[premio.tipo] || 0) + premio.cantidad;

    let accion = acciones[command];
    let mensajeAleatorio = accion.mensajes[Math.floor(Math.random() * accion.mensajes.length)];

    await conn.sendMessage(m.chat, { react: { text: accion.emoji, key: m.key }});
    await m.reply(`${mensajeAleatorio}\n🎁 ¡Ganaste *${premio.cantidad}* ${premio.tipo}!`);
};

handler.command = ['agua', 'pasear', 'viajar', 'acariciar'];
export default handler;