
const subbotConfig = {};

const handler = async (m, { conn, args, command}) => {
    const subbotId = m.sender;

    if (!subbotConfig[subbotId]) {
        subbotConfig[subbotId] = {
            name: 'Subbot',
            color: 'blue',
            style: 'normal',
            description: 'Soy un subbot listo para ayudarte.'
};
}

    if (command === 'newname') {
        if (!args[0]) return m.reply('❌ *Error:* Debes escribir el nuevo nombre después de `.newname`.');
        subbotConfig[subbotId].name = args.join(' ');
        return m.reply(`✅ *¡Nombre cambiado con éxito!* 📌 Nuevo nombre: *${subbotConfig[subbotId].name}*`);
}

    if (command === 'setcolor') {
        if (!args[0]) return m.reply('❌ *Error:* Especifica un color después de `.setcolor`.');
        subbotConfig[subbotId].color = args[0].toLowerCase();
        return m.reply(`✅ *¡Color del texto actualizado!* 🎨 Nuevo color: *${subbotConfig[subbotId].color}*`);
}

    if (command === 'setstyle') {
        if (!args[0]) return m.reply('❌ *Error:* Especifica un estilo después de `.setstyle`.');
        subbotConfig[subbotId].style = args[0].toLowerCase();
        return m.reply(`✅ *¡Estilo del texto actualizado!* ✍️ Nuevo estilo: *${subbotConfig[subbotId].style}*`);
}

    if (command === 'setdescription') {
        if (!args[0]) return m.reply('❌ *Error:* Escribe una descripción después de `.setdescription`.');
        subbotConfig[subbotId].description = args.join(' ');
        return m.reply(`✅ *¡Descripción personalizada guardada!* 📜 Nueva descripción: *${subbotConfig[subbotId].description}*`);
}

    if (command === 'profileinfo') {
        return m.reply(`📌 *Perfil de tu subbot:*\n📢 *Nombre:* ${subbotConfig[subbotId].name}\n🎨 *Color:* ${subbotConfig[subbotId].color}\n✍️ *Estilo:* ${subbotConfig[subbotId].style}\n📜 *Descripción:* ${subbotConfig[subbotId].description}`);
}
};

handler.command = /^(|setcolor|setstyle|setdescription|profileinfo)$/i;
export default handler;