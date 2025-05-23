
let handler = async (m) => {
    const memes = [
        'https://i.imgur.com/1.jpg', // Reemplaza con enlaces a tus memes
        'https://qu.ax/dpYLN.jpg',
        'https://qu.ax/YvLWt.jpg',
        'https://qu.ax/FxBzq.jpg',
        'https://qu.ax/oRkAi.jpg',
        'https://qu.ax/Gfnrz.jpg',
        'https://qu.ax/UFWsB.jpg',
        'https://qu.ax/rubYe.jpg',
        'https://qu.ax/UFWsB.jpg',
        'https://qu.ax/uyjpK.jpg',
        'https://qu.ax/RcxFR.jpg',
        'https://qu.ax/MctMj.jpg',
        'https://qu.ax/znbWC.jpg',
        'https://qu.ax/lLJMP.jpg',        
        'https://qu.ax/HhOVP.jpg',
        'https://qu.ax/yQoQW.jpg',
        'https://qu.ax/msDFZ.jpg',
        'https://qu.ax/MTDhM.jpg',
        'https://qu.ax/hFQOL.jpg',
        'https://qu.ax/hFQOL.jpg',
        'https://qu.ax/iHSQp.jpg',
        'https://qu.ax/dWkJV.jpg',
        'https://qu.ax/jyaXq.jpg',
        'https://qu.ax/iTDtj.jpg',
        'https://qu.ax/GjjKW.jpg', 
        'https://qu.ax/JOqKm.jpg',
        'https://qu.ax/ztadH.jpg',
        'https://qu.ax/FQCDQ.jpg',
        'https://qu.ax/nQqCP.jpg',
        'https://qu.ax/QxSun.jpg',
        'https://qu.ax/tXWnk.jpg',
        'https://qu.ax/EuuUz.jpg',
        'https://qu.ax/enMBc.jpg',
        'https://qu.ax/QpCpk.jpg',
        'https://qu.ax/UbtkV.jpg',
      

    ];

    // Elegir un meme aleatorio
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // Enviar el meme al chat
    await conn.sendMessage(m.chat, { image: { url: randomMeme }, caption: "¡Aquí tienes un meme para alegrar tu día!" }, { quoted: m });
}

handler.help = ['meme'];
handler.tags = ['diversión'];
handler.command = ['meme'];

export default handler;
