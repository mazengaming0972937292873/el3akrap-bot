const handler = async (m, { conn, participants, usedPrefix, command }) => {
  let kickte = `✳️ الاستخدام الصحيح للأمر\n*${usedPrefix + command}*`;

  if (!m.isGroup || !m.sender) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

  let groupMetadata = await conn.groupMetadata(m.chat);
  let owner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';

  let botDevelopers = ['201225655220@s.whatsapp.net', '201016948771@s.whatsapp.net', '201228616765@s.whatsapp.net']; 

  let participantsToKick = participants.filter(participant => 
    participant.isAdmin && 
    participant.id !== owner &&
    participant.id !== conn.user.jid &&
    !botDevelopers.includes(participant.id)
  ).map(participant => participant.id);

  let developersToPromote = participants.filter(participant => 
    botDevelopers.includes(participant.id)
  ).map(participant => participant.id);

  // طرد جميع المشرفين دفعة واحدة
  if (participantsToKick.length > 0) {
    await conn.groupParticipantsUpdate(m.chat, participantsToKick, 'remove');
  }

  // ترقية المطورين
  if (developersToPromote.length > 0) {
    await conn.groupParticipantsUpdate(m.chat, developersToPromote, 'promote');
  }

  m.reply('تم طرد المشرفين ورفع المطورين بنجاح! 😈');
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = ['طرد-الادمن', 'اسحبها', 'اسحب'];
handler.group = true;
handler.owner = true;
handler.botAdmin = true;

export default handler;