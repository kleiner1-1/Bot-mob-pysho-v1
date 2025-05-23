
let handler = async (m, { conn }) => {
   // Define la cantidad de dulces a otorgar
   const rewardAmount = 400;

   // Obtén la información del usuario
   let user = global.db.data.users[m.sender];

   // Suma los dulces a la cuenta del usuario
   user.limit += rewardAmount; // Asumiendo que 'limit' representa la cantidad de dulces

   await m.reply(`🎉 ¡Has reclamado *${rewardAmount}* 🍬 Dulces! Ahora tienes un total de *${user.limit}* 🍬. ¡Disfrútalos y sigue jugando! 🎊`);
}

handler.help = ['claim3'];
handler.tags = ['rpg'];
handler.command = ['claim3'];
handler.register = true;
export default handler;