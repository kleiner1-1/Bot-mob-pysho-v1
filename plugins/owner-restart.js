let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('Solo el owner puede reiniciar el bot.')
  await m.reply('Ya vuelvo enseguida :)')
  await m.reply('Bot reiniciado correctamente.')
  process.exit(0)
}

handler.help = ['reiniciar', 'restart']
handler.tags = ['owner']
handler.command = ['reiniciar', 'restart']
handler.owner = true

export default handler