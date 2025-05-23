
let handler = async (m, { conn }) => {
   // Define las recompensas
   const rewardCandies = 1000;
   const rewardXP = 1000;

   // Obtén la información del usuario
   let user = global.db.data.users[m.sender];

   // Verifica si el usuario ya ha reclamado la recompensa de .masc
   if (!user.hasClaimedMasc) {
      // Suma las recompensas al usuario
      user.limit += rewardCandies; // Asumiendo que 'limit' representa la cantidad de dulces
      user.exp += rewardXP; // Aumenta la experiencia del usuario

      // Marca que el usuario ha reclamado la recompensa
      user.hasClaimedMasc = true;

      await m.reply(`🎉 ¡Has usado el comando *!masc*! Has recibido *${rewardCandies}* 🍬 Dulces y *${rewardXP} XP*! Ahora tienes un total de *${user.limit}* 🍬 y *${user.exp} XP*. ¡Disfrútalos! 🎊`);
   } else {
      await m.reply(`😟 Ya has utilizado el comando *!masc* anteriormente. No puedes reclamar más recompensas. 🛑`);
   }
}

handler.help = ['masc'];
handler.tags = ['rpg'];
handler.command = ['masc'];
handler.register = true;
export default handler;