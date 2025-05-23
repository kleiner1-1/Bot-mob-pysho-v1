const cooldowns = {};

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users;
  let senderId = m.sender;
  let senderName = await conn.getName(senderId);

  let tiempoEspera = 5 * 60 * 1000; // 5 minutos en milisegundos

  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempoEspera) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempoEspera - Date.now()) / 1000));
    return m.reply(`🍭 Ya has cometido un crimen recientemente, espera ⏱ *${tiempoRestante}* para cometer otro.`);
  }

  cooldowns[senderId] = Date.now();

  let senderLimit = users[senderId].limit || 0;

  let userIds = Object.keys(users).filter(id => id !== senderId);
  if (userIds.length === 0) return m.reply("❌ No hay suficientes jugadores para robar.");

  let randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
  let randomUserLimit = users[randomUserId].limit || 0;

  let minAmount = 15, maxAmount = 50;
  let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

  let randomOption = Math.floor(Math.random() * 3);

  switch (randomOption) {
    case 0:
      users[senderId].limit += amountTaken;
      users[randomUserId].limit = Math.max(randomUserLimit - amountTaken, 0);
      conn.sendMessage(m.chat, {
        text: `🍭 ¡Lograste cometer tu crimen con éxito! Acabas de robar *${amountTaken} 🍭 Dulces* a @${randomUserId.split("@")[0]}.\n\nSe suman *+${amountTaken} 🍭 Dulces* a ${senderName}.`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m });
      break;

    case 1:
      let amountSubtracted = Math.min(Math.floor(Math.random() * (senderLimit - minAmount + 1)) + minAmount, maxAmount);
      users[senderId].limit = Math.max(senderLimit - amountSubtracted, 0);
      m.reply(`🍭 No fuiste cuidadoso y te atraparon mientras cometías tu crimen. Se restaron *-${amountSubtracted} 🍬 Dulces* a ${senderName}.`);
      break;

    case 2:
      let smallAmountTaken = Math.min(Math.floor(Math.random() * (randomUserLimit / 2 - minAmount + 1)) + minAmount, maxAmount);
      users[senderId].limit += smallAmountTaken;
      users[randomUserId].limit = Math.max(randomUserLimit - smallAmountTaken, 0);
      conn.sendMessage(m.chat, {
        text: `🍭 Lograste cometer tu crimen con éxito, pero te descubrieron y solo lograste tomar *${smallAmountTaken} 🍬 Dulces* de @${randomUserId.split("@")[0]}.\n\nSe suman *+${smallAmountTaken} 🍬 Dulces* a ${senderName}.`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m });
      break;
  }

  global.db.write();
};

handler.tags = ["rpg"];
handler.help = ["crimen"];
handler.command = ["crimen", "crime"];
handler.register = true;
handler.group = true;

export default handler;

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = segundos % 60;
  return `${minutos} minutos y ${segundosRestantes} segundos`;
}