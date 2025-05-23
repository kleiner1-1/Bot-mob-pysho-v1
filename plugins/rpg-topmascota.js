
let handler = async (m, { conn }) => {
    const mascotas = [
        { nombre: "Perro", puntos: 1000 },
        { nombre: "Gato", puntos: 800 },
        { nombre: "Loro", puntos: 600 },
        { nombre: "Conejo", puntos: 500 },
        { nombre: "Hámster", puntos: 300 }
    ];

    // Ordenar las mascotas por puntos en orden descendente
    mascotas.sort((a, b) => b.puntos - a.puntos);

    // Construir el mensaje del ranking
    let mensajeRanking = "🏆 Ranking de Mascotas 🏆\n\n";
    
    mascotas.forEach((mascota, index) => {
        mensajeRanking += `${index + 1}. ${mascota.nombre} - ${mascota.puntos} puntos\n`;
    });

    await conn.sendMessage(m.chat, { text: mensajeRanking }, { quoted: m });
}

handler.help = ['topmascota'];
handler.tags = ['juegos'];
handler.command = ['topmascota'];

export default handler;