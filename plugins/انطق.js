import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const defaultLang = 'ar';

// دالة الـ handler الأسطورية اللي بتاخد وقتها وبتخلص المهمة
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let lang = args[0];
  let text = args.slice(1).join(' ');

  // لو المستخدم كتب لغة مش بالطول المطلوب أو ما كتبش لغة، نخليها الافتراضية
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // لو مفيش نص، نستخدم النص المقتبس لو موجود
  if (!text && m.quoted?.text) text = m.quoted.text;

  let res;
  try {
    res = await tts(text, lang);
  } catch (e) {
    m.reply(e + '');
    text = args.join(' ');
    if (!text) throw `*هــكذا : ${usedPrefix}${command} مرحبا*`;
    res = await tts(text, defaultLang);
  } finally {
    if (res) conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
  }
};

handler.help = ['tts <lang> <task>'];
handler.tags = ['tools'];
handler.command = ['tts', 'انطق'];

export default handler;

// دالة الـ tts اللي بتعمل شغلها بصمت وهدوء
function tts(text, lang = 'ar-ar') {
  console.log(lang, text);
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      let filePath = join(__dirname, '../tmp', `${Date.now()}.wav`);
      tts.save(filePath, text, () => {
        resolve(readFileSync(filePath));
        unlinkSync(filePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}