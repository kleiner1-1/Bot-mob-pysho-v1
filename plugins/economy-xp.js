
const carteras = {}; // { userId: { monedas: 0, dulces: 0, xp: 0 } }

const handler = async (m) => {
    if (m.text.startsWith('.xp')) {
        const usuarioId = m.sender; // Obtener el identificador del usuario

        // Verificar si el usuario tiene una cartera
        if (!carteras[usuarioId]) {
            return m.reply("❌ No tienes una cartera creada. ¡Participa en actividades para empezar a ganar experiencia!");
        }

        const xpActual = carteras[usuarioId].xp; // Obtener la experiencia actual

        // Mensaje a enviar
        const mensaje = `📊 *Experiencia Actual*\n\n✨ Tienes ${xpActual} XP. ¡Sigue participando para ganar más!`;

        return m.reply(mensaje);
    }
};

handler.command = /^(xp)$/i;
export default handler;