
let handler = async (m, { conn }) => {
   // Define las recompensas
   const rewardCandies = 50;
   const rewardXP = 100;

   // Obtén la información del usuario
   let user = global.db.data.users[m.sender];

   // Verifica si el usuario ya ha abierto el cofre hoy
   let now = new Date();
   let lastOpened = user.lastCofreOpen || 0;
   
   // Si no ha abierto el cofre hoy, se puede abrir
   if (lastOpened < now.setHours(0, 0, 0, 0)) {
      // Suma las recompensas al usuario
      user.limit += rewardCandies; // Asumiendo que 'limit' representa la cantidad de dulces
      user.exp += rewardXP; // Aumenta la experiencia del usuario

      // Actualiza la fecha de apertura del cofre
      user.lastCofreOpen = now.getTime();

      await m.reply(`🎉 ¡Has abierto el cofre! Has recibido *${rewardCandies}* 🍬 Dulces y *${rewardXP} XP*! Ahora tienes un total de *${user.limit}* 🍬 y *${user.exp} XP*. ¡Disfrútalos! 🎊`);
   } else {
      await m.reply(`😟 Ya has abierto el cofre hoy. Vuelve mañana para reclamar tu recompensa. 🕒`);
   }
}

handler.help = ['abrircofre'];
handler.tags = ['rpg'];
handler.command = ['abrircofre'];
handler.register = true;
export default handler;