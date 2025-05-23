
let handler = async (m, { conn }) => {
    // Definimos algunos destinos aleatorios
    const destinos = [
        "la playa 🏖️",
        "la montaña ⛰️",
        "un bosque encantado 🌲✨",
        "una ciudad mágica 🏙️",
        "un parque de diversiones 🎢"
    ];

    // Elegimos un destino aleatorio
    const destinoElegido = destinos[Math.floor(Math.random() * destinos.length)];

    // Mensaje sobre el viaje
    const mensajeViaje = `¡Tu mascota está lista para viajar! 🐾✈️\nDestino: ${destinoElegido}\n¡Prepárate para la aventura!`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: mensajeViaje }, { quoted: m });
}

handler.help = ['viajar'];
handler.tags = ['mascotas'];
handler.command = ['viajar'];

export default handler;