let cooldowns = {}

let handler = async (m, { conn, text, command }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  // Tiempo de enfriamiento (en segundos)
  let tiempoEspera = 5 * 60

  // Verificar si el jugador está en tiempo de enfriamiento
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    m.reply(`🌲 Ya exploraste el bosque recientemente. Espera ⏳ *${tiempoRestante}* antes de aventurarte de nuevo.`)
    return
  }

  // Actualizar el tiempo de enfriamiento
  cooldowns[m.sender] = Date.now()

  if (!users[senderId]) {
    users[senderId] = { Monedas: 0, Inventario: [] }
  }

  let senderMonedas = users[senderId].Monedas || 0
  let inventario = users[senderId].Inventario || []

  // Generar resultado aleatorio
  const eventos = [
    { nombre: '💎 Tesoro Escondido', monedas: 100, mensaje: '¡Encontraste un cofre lleno de Monedas!' },
    { nombre: '🐻 Oso Salvaje', monedas: -50, mensaje: 'Un oso te atacó y perdiste algunas Monedas mientras escapabas.' },
    { nombre: '🕸️ Trampa Antigua', monedas: 0, mensaje: 'Caiste en una trampa, pero lograste escapar ileso.' },
    { nombre: '🌟 Piedra Mágica', monedas: 200, mensaje: '¡Descubriste una piedra mágica que te otorgó Monedas adicionales!' },
    { nombre: '🧙 Viejo Sabio', monedas: 50, mensaje: 'Un sabio te recompensó por escuchar sus historias.' },
    { nombre: '⚔️ Enemigo Oculto', monedas: -30, mensaje: 'Te enfrentaste a un enemigo oculto y perdiste algunas Monedas.' },
    { nombre: '🍄 Setas Extrañas', monedas: 0, mensaje: 'Comiste unas setas del bosque, pero no pasó nada interesante.' }
  ]

  let evento = eventos[Math.floor(Math.random() * eventos.length)]

  // Actualizar monedas e inventario según el evento
  if (evento.monedas > 0) {
    users[senderId].Monedas += evento.monedas
    m.reply(`🌲 ${evento.mensaje}\n\nGanaste *+${evento.monedas} 🪙 Monedas*. Ahora tienes un total de *${users[senderId].Monedas} 🪙 Monedas*.`)
  } else if (evento.monedas < 0) {
    users[senderId].Monedas += evento.monedas
    m.reply(`🌲 ${evento.mensaje}\n\nPerdiste *${Math.abs(evento.monedas)} 🪙 Monedas*. Ahora tienes un total de *${users[senderId].Monedas} 🪙 Monedas*.`)
  } else {
    m.reply(`🌲 ${evento.mensaje}\n\nNo ganaste ni perdiste Monedas. Tu saldo sigue siendo *${users[senderId].Monedas} 🪙 Monedas*.`)
  }

  // Guardar el evento en el inventario
  inventario.push(evento.nombre)
  users[senderId].Inventario = inventario

  // Guardar la base de datos
  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['explorar']
handler.command = ['explorar', 'adventure', 'bosque']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}