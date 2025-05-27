import moment from 'moment-timezone';

const whoisHandler = async (m, { conn, participants }) => {
  const mentioned = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const num = mentioned.split('@')[0];
  const waLink = `https://wa.me/${num}`;
  const isLid = mentioned.endsWith('@lid') ? 'Sí (@lid)' : 'No (@s.whatsapp.net)';
  const name = conn.getName(mentioned) || 'No disponible';

  let about = 'No disponible';
  try {
    const statusObj = await conn.fetchStatus(mentioned);
    about = statusObj?.status || 'No disponible';
  } catch {}

  let ppUrl;
  let hasPhoto = true;
  try {
    ppUrl = await conn.profilePictureUrl(mentioned, 'image');
  } catch {
    hasPhoto = false;
    ppUrl = 'https://i.imgur.com/9Z4dF5x.png';
  }

  let groupInfo = '';
  if (m.isGroup) {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const user = groupMetadata.participants.find(u => u.id === mentioned);
    if (user) {
      const role = user.id === groupMetadata.owner ? 'Creador' : (user.admin ? 'Admin' : 'Miembro');
      groupInfo = `│ • Rol en grupo: ${role}\n`;
    }
  }

  const prefix = num.slice(0, 3);
  const paises = {
    '502': 'Guatemala', '503': 'El Salvador', '504': 'Honduras',
    '505': 'Nicaragua', '506': 'Costa Rica', '507': 'Panamá',
    '521': 'México', '549': 'Argentina', '34': 'España',
    '1': 'EE.UU / Canadá', '55': 'Brasil'
  };
  const pais = Object.entries(paises).find(([pre]) => num.startsWith(pre))?.[1] || 'Desconocido';

  const zona = {
    'Guatemala': 'America/Guatemala', 'México': 'America/Mexico_City',
    'Argentina': 'America/Argentina/Buenos_Aires', 'España': 'Europe/Madrid',
    'EE.UU / Canadá': 'America/New_York', 'Brasil': 'America/Sao_Paulo'
  }[pais] || 'UTC';
  const horaLocal = moment().tz(zona).format('HH:mm:ss');
  const fecha = moment().format('DD/MM/YYYY');

  const caption = `
╭───[ *WHOIS* ]
│ • Número: ${waLink}
│ • Nombre: ${name}
│ • About: ${about}
│ • JID: ${mentioned}
│ • Multi-dispositivo: ${isLid}
│ • Foto de perfil: ${hasPhoto ? 'Sí' : 'No'}
│ • País estimado: ${pais}
│ • Hora local: ${horaLocal}
│ • Fecha: ${fecha}
${groupInfo}╰────`.trim();

  await conn.sendFile(m.chat, ppUrl, 'profile.jpg', caption, m);
};

whoisHandler.command = ['whois', 'scan', 'infohack'];
whoisHandler.tags = ['info'];
whoisHandler.help = ['whois @usuario'];

export default whoisHandler;