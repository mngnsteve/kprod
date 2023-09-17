const { AttachmentBuilder } = require('discord.js');
const { GlobalFonts, loadImage, createCanvas } = require('@napi-rs/canvas');
// const { createCanvas, loadImage, registerFont } = require('canvas');
// registerFont('./ZenDots-Regular.ttf', { family: 'Zen Dots' });
GlobalFonts.registerFromPath('/home/container/Fonts/ChunkFive-Regular.otf', 'ChunkFive');

module.exports = async (background, avatar, user, guild, join) => {
    let image = {};
    let attachment;
    let bg = await loadImage(background);
    let pp = await loadImage(avatar);
    let msg = join < 1 ? "BIENVENU !" : "AUREVOIR !";

    image.create = createCanvas(1024, 500);
    image.context = image.create.getContext("2d");
    image.context.font = '72px ChunkFive';
    image.context.fillStyle = "#FFFFFF";

    image.context.drawImage(bg, 0, 0, 1024, 500);
    image.context.fillText(msg, 300, 360);
    image.context.lineWidth = 3;
    image.context.strokeStyle = "#000000";
    image.context.strokeText(msg, 300, 360);
    image.context.beginPath();
    image.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    image.context.stroke();
    image.context.fill();

    let canvas = image;
    canvas.context.font = '42px ChunkFive';
    canvas.context.textAlign = 'center';
    canvas.context.fillText(user.tag.toUpperCase(), 512, 410);
    canvas.context.lineWidth = 2;
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeText(user.tag.toUpperCase(), 512, 410);
    canvas.context.font = '38px ChunkFive';
    canvas.context.fillText(`Il y a maintenant ${guild.memberCount} personnes dans le serveur !`, 512, 455);
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeText(`Il y a maintenant ${guild.memberCount} personnes dans le serveur !`, 512, 455);
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    canvas.context.drawImage(pp, 393, 47, 238, 238);
    attachment = new AttachmentBuilder(await canvas.context.canvas.encode('png', { name: `welcome-${user.id}.png` }));
    // attachment = new AttachmentBuilder(, { name: `welcome-${user.id}.png` });
    return attachment;
}
