import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
    const vn = './media/احلي_تحية_لأحلي_جروب.m4a';
    try {
        await fs.access(vn); // Check if the file exists
        conn.sendPresenceUpdate('recording', m.chat);
        await conn.sendMessage(m.chat, {audio: {url: vn}, ptt: true, mimetype: 'audio/mpeg', fileName: `احلي_تحية_لأحلي_جروب.m4a`}, {quoted: m});
    } catch (e) {
        console.error('Error sending the audio message:', e);
    }
};

conn.ev.on('group-participants.update', async (update) => {
    console.log('Group participants update:', update);
    if (update.action === 'add' && update.participants.includes(conn.user.jid)) {
        console.log('Bot has been added to the group:', update.id);
        const vn = './media/احلي_تحية_لأحلي_جروب.m4a';
        try {
            await fs.access(vn); // Check if the file exists
            conn.sendPresenceUpdate('recording', update.id);
            await conn.sendMessage(update.id, {audio: {url: vn}, ptt: true, mimetype: 'audio/mpeg', fileName: `احلي_تحية_لأحلي_جروب.m4a`});
            console.log('Audio message sent to the group.');
        } catch (e) {
            console.error('Error sending the audio message on group join:', e);
        }
    }
});

handler.help = ['notification'];
handler.tags = ['notification'];
handler.command = ['احلي_تحية_لأحلي_جروب', 'احلي جروب', 'احلي تحية', 'تحية'];
handler.customPrefix = /^(احلي جروب|تحية|احلي تحية)$/i;
handler.command = new RegExp;
export default handler;