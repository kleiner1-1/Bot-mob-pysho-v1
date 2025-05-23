const handler = async (m, { conn }) => {
  let gifUrl = "https://qu.ax/Mvhfa.jpg";

  let text = `
 ──────── ⚔ ────────  
     *COMUNIDAD*  
──────── ⚔ ────────  

*Bot mob pysho*  
• ,👥➤ **Grupo de WhatsApp de la comunidad de Bot mob pysho Ai**  
   Únete para compartir y resolver dudas con otros usuarios. 
  ➤https://whatsapp.com/channel/0029Vb63Kf9KwqSQLOQOtk3N

• 📢 ➤ *Canal de Bot Mob Pysho Ai*  
   Recibe actualizaciones, noticias y lanzamientos del bot.  
https://whatsapp.com/channel/0029Vb63Kf9KwqSQLOQOtk3N
• 💬 ➤ *Grupo de WhatsApp activo*  
   Chatea con usuarios en tiempo real y sé parte de la conversación y usa al bot que esta de uso libre.  
➤https://chat.whatsapp.com/Bi3Hy4y4RL8DyNyiH5OMEd

──────── ⚔ ────────  
🔍 *¿Sabías que...?* 
- El bot Mob Pysho Ai es actualizado regularmente para mejorar su desempeño.  
- Puedes sugerir mejoras o reportar errores directamente en los grupos.  
- Nuestra comunidad sigue creciendo y cuenta con soporte activo.  
-
`.trim();


  await conn.sendMessage(
    m.chat,
    {
      video: { url: gifUrl },
      gifPlayback: true, 
      caption: text,
      mentions: [m.sender], 
    },
    { quoted: m }
  );
};

handler.command = /^(comunidad)$/i; 
export default handler;