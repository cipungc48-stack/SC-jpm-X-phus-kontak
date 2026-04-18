require("./config.js");
require("./lib/fakeq.js");
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const { exec, spawn, execSync } = require('child_process');
const { prepareWAMessageMedia, generateWAMessageFromContent } = require("baileys");
global.uploadImageBuffer = require("./lib/tourl.js").uploadImageBuffer;
global.CatBox = require("./lib/tourl.js")
global.tiktok = require("./lib/tiktok.js");
global.igdl = require("./lib/igdl.js");
const loadDb = require("./lib/load_database.js");

module.exports = async (sock, m) => {
  await loadDb(sock, m);
  const isCmd = m?.body?.startsWith(prefix);
  const quoted = m.quoted ? m.quoted : m;
  const mime = quoted?.msg?.mimetype || quoted?.mimetype || null;
  const args = m?.body?.trim().split(/ +/).slice(1) || [];
  const qmsg = m.quoted || m;
  const text = args.join(" ");
  const command = isCmd
    ? m.body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
    : "";
  const cmd = prefix + command;
  const isOwner = m.isOwner
  const metadata = m.isGroup
    ? (await global.groupMetadataCache.get(m.chat) || {})
    : {};
  const admins = metadata?.participants
    ? metadata.participants.filter(p => p.admin !== null).map(p => p.id)
    : [];
  m.isAdmin = m.isGroup && admins ? admins.includes(m.sender) : false
  m.isBotAdmin = m.isGroup && admins ? admins.includes(m.botNumber) : false
    

  if (isCmd) {
    console.log(
      chalk.white("• Sender  :"), chalk.blue(m.chat),
      "\n" + chalk.white("• Group   :"), chalk.blue(m.isGroup ? metadata.subject : "Private"),
      "\n" + chalk.white("• Command :"), chalk.blue(cmd),
      "\n"
    );
  }
  
  
  const rowsMenu = [
  { title: "⭐ All Menu", id: ".allmenu", description: "Menampilkan semua list all menu" },
  { title: "🌀 Main Menu", id: ".mainmenu", description: "Menampilkan semua list main menu" },
  { title: "🛍️ Store Menu", id: ".storemenu", description: "Menampilkan list store menu" }, 
  { title: "🕊️ Owner Menu", id: ".ownermenu", description: "Menampilkan list owner menu" }
];

 global.textStoremenu = `  ┌──────
  ├─── ▢ Storemenu
  ├─ jpm
  ├─ bljpm
  ├─ delbljpm
  ├─ pushkontak
  ├─ setjedapush
  └`
 global.textMainmenu = `  ┌──────
  ├─── ▢ Mainmenu
  ├─ tourl
  ├─ cekidch
  ├─ sticker
  ├─ ttdl
  ├─ igdl
  └`

 global.textOwnermenu = `  ┌──────
  ├─── ▢ Ownermenu
  ├─ bljpm
  ├─ delbljpm
  ├─ setjedapush
  ├─ stoppush
  └`

  switch (command) {
  
case "mainmenu": case "storemenu": case "ownermenu": case "menu": case "allmenu": {
    const os = require("os");
const start = process.hrtime.bigint();
const end = process.hrtime.bigint();
const speed = Number(end - start) / 1e6; // ms
const used = (process.memoryUsage().rss / 1024 / 1024 / 1024).toFixed(2);
const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    let teks = `
  Hii @${m.sender.split("@")[0]} 👋
    
  ▢ Speed : _${speed}ms_
  ▢ Runtime : ${runtime(process.uptime())}
  ▢ Ram : ${used}GB/${total}GB
`
 global.imageMenu = global.imageMenu ? global.imageMenu : await prepareWAMessageMedia({ image: { url: global.thumbnail } },{ upload: sock.waUploadToServer })
 
 if (command == "mainmenu") teks = `
${global.textMainmenu}
`
 if (command == "storemenu") teks = `
${global.textStoremenu}
`
 if (command == "ownermenu") teks = `
${global.textOwnermenu}
`
 if (command == "allmenu") teks += `
${global.textMainmenu}

${global.textStoremenu}

${global.textOwnermenu}
`
    
let msg = await generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            interactiveMessage: {
                header: {
                    ...global.imageMenu,
                    hasMediaAttachment: true
                },
                body: { 
                    text: teks 
                },
                nativeFlowMessage: {
                    buttons: [
                                    {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "List Menu",
                    sections: [
                      {
                        title: `© Powered By ${global.ownerName}`,
                        highlight_label: "Recommended",
                        rows: rowsMenu
                      }
                    ]
                  })
                }, 
                                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    title: "List Menu",
                    sections: [
                      {
                        title: `© Powered By ${global.ownerName}`,
                        highlight_label: "Recommended",
                        rows: rowsMenu
                      }
                    ]
                  })
                }, 
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: "Contact Developer",
                                url: global.linkOwner,
                                merchant_url: global.linkOwner
                            })
                        }
                    ],
                    messageParamsJson: JSON.stringify({
                        limited_time_offer: {
                            text: `${global.botName} - ${global.versionBot}`,
                            url: global.linkOwner,
                            copy_code: "1",
                            expiration_time: 0
                        },
                        bottom_sheet: {
                            in_thread_buttons_limit: 2,
                            divider_indices: [1, 2, 3, 4, 5, 999],
                            list_title: `Powered by ${namaOwner}`,
                            button_title: `List Menu`
                        },
                        tap_target_configuration: {
                            title: "1",
                            description: "bomboclard",
                            canonical_url: global.linkOwner,
                            domain: "shop.example.com",
                            button_index: 0
                        }
                    })
                },
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }
        }
    }
}, { 
    userJid: m.sender,
    quoted: global.qtext
});

await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }
    break
    
case "delbl":
case "delbljpm": {
    if (!isOwner) return m.reply(mess.owner);

    if (db.settings.bljpm.length < 1) 
        return m.reply("Tidak ada data blacklist grup.");

    const groups = await sock.groupFetchAllParticipating();
    const Data = Object.values(groups);

    let rows = [];
    rows.push({
        title: "🗑️ Hapus Semua",
        description: "Hapus semua grup dari blacklist",
        id: `.delbl-response all`
    });

    for (let id of db.settings.bljpm) {
        let name = "Unknown";
        let grup = Data.find(g => g.id === id);
        if (grup) name = grup.subject || "Unknown";
        rows.push({
            title: name,
            description: `ID Grup - ${id}`,
            id: `.delbl-response ${id}|${name}`
        });
    }

    let msg = await generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `Pilih Grup Untuk Dihapus Dari Blacklist\n\nTotal Blacklist: ${db.settings.bljpm.length}` 
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Daftar Blacklist Grup",
                                    sections: [
                                        {
                                            title: "Blacklist Terdaftar",
                                            rows: rows
                                        }
                                    ]
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;

//==================================//

case "delbl-response": {
    if (!isOwner) return m.reply(mess.owner);
    if (!text) return;

    if (text === "all") {
        db.settings.bljpm = [];
        return m.reply("✅ Semua data blacklist grup berhasil dihapus.");
    }

    if (text.includes("|")) {
        const [id, grupName] = text.split("|");
        if (!db.settings.bljpm.includes(id)) 
            return m.reply(`Grup *${grupName}* tidak ada dalam blacklist.`);

        db.settings.bljpm = db.settings.bljpm.filter(g => g !== id);
        return m.reply(`✅ Grup *${grupName}* berhasil dihapus dari blacklist.`);
    }
}
break;

case "setjeda": case "setjedapush": {
    if (!isOwner) return m.reply(mess.owner)

    if (!args[0]) return m.reply(
        `Masukkan jeda push!\n\nContoh: ${cmd} 5000\n1000 = 1 detik\n\nJeda saat ini: ${global.jedaPushkontak.toString().split("0")[0]} detik`
    )

    let delay = parseInt(args[0])
    if (isNaN(delay) || delay < 0) {
        return m.reply("Jeda harus berupa angka (ms) yang valid!")
    }

    try {
        let settingPath = "./config.js"
        let file = fs.readFileSync(settingPath, "utf8")

        let updated = file.replace(
            /global\.jedaPushkontak\s*=\s*\d+/,
            `global.jedaPushkontak = ${delay}`
        )

        fs.writeFileSync(settingPath, updated)
        global.jedaPushkontak = delay
    } catch (err) {
        console.error(err)
        return m.reply("Gagal mengubah jeda push ❌")
    }

    return m.reply(`Jeda pushkontak berhasil diubah menjadi *${delay.toString().split("0")[0]} detik* ✅`)
}
break
    
case "bljpm": case "bl": {
if (!isOwner) return m.reply(mess.owner);
if (!text) {
let rows = []
const a = await sock.groupFetchAllParticipating()
if (a.length < 1) return Reply("Tidak ada grup chat.")
const Data = Object.values(a)
let number = 0
for (let u of Data) {
const name = u.subject || "Unknown"
rows.push({
title: name,
description: `ID - ${u.id}`, 
id: `.bljpm ${u.id}|${name}`
})
}
return sock.sendMessage(m.chat, {
  buttons: [
    {
    buttonId: 'action',
    buttonText: { displayText: 'ini pesan interactiveMeta' },
    type: 4,
    nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup',
          sections: [
            {
              title: `Pilih Salah Satu Grup Chat`,
              rows: rows
            }
          ]
        })
      }
      }
  ],
  headerType: 1,
  viewOnce: true,
  text: `\nPilih Salah Satu Grup Chat\n`
}, { quoted: m })
}
let [id, name] = text.split("|")
if (!id || !name) return
if (db.settings.bljpm.includes(id)) return m.reply(`Grup *${name}* sudah terdaftar dalam data Blacklist Jpm!`)
db.settings.bljpm.push(id)
return m.reply(`✅ Grup *${name}* Berhasil ditambahkan kedalam data Blacklist Jpm.`)
}
break

case "jasher":
case "jpm":
case "jaser": {
  if (!isOwner) return m.reply(mess.owner);
  if (!text) return m.reply(`*Contoh Penggunaan:*
${cmd} pesannya & bisa dengan foto juga`);
  let mediaPath;
  if (/image/.test(mime)) {
    mediaPath = await m.quoted ? await m.quoted.download() : await m.download()
  }
  const allGroups = await sock.groupFetchAllParticipating();
  const groupIds = Object.keys(allGroups);
  let successCount = 0;
  let fail = 0;
  let bl = 0;
  await m.reply(`🚀 Memproses ${mediaPath ? "Jpm Teks & Foto" : "Jpm Teks"}\n- Total Grup: ${groupIds.length}`);
  for (const id of groupIds) {
  if (db.settings.bljpm.includes(id)) {
  bl += 1
  continue
  }
    try {
      if (mediaPath) {
        await sock.sendMessage(id, {
          image: mediaPath,
          caption: text
        });
      } else {
        await sock.sendMessage(id, { text }, { quoted: qtext });
      }
      successCount++;
    } catch (e) {
      fail += 1
      console.error(`Gagal kirim ke grup ${id}:`, e);
    }
    await sleep(4000);
  }
  await sock.sendMessage(m.chat, {
    text: `Jpm ${mediaPath ? "Teks & Foto" : "Teks"} berhasil dikirim ✅
Berhasil: ${successCount}
Gagal: ${fail}
Blacklist: ${bl}`
  }, { quoted: m });
}
break;

case "stalkch":
case "sch":
case "idch":
case "cekidch": {
    if (!text) return m.reply(`*Contoh:* ${cmd} link/id channel`)
    if (!text.includes("https://whatsapp.com/channel/") && !text.includes("@newsletter"))
        return m.reply("Link atau id channel tidak valid")

    let result = text.trim(), opsi = "jid"
    if (text.includes("https://whatsapp.com/channel/")) {
        result = text.split("https://whatsapp.com/channel/")[1]
        opsi = "invite"
    }

    const res = await sock.newsletterMetadata(opsi, result)
    const teks =
        `*Channel Information 🌍*\n\n` +
        `- Nama: ${res.name}\n` +
        `- Total Pengikut: ${toRupiah(res.subscribers)}\n` +
        `- ID: ${res.id}\n` +
        `- Link: https://whatsapp.com/channel/${res.invite}`

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: teks },
                    nativeFlowMessage: {
                        buttons: [
                            { name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "Copy Channel ID", copy_code: res.id }) }
                        ]
                    }
                }
            }
        }
    }, { userJid: m.sender, quoted: m })

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
break

case "pushkontak":
case "puskontak": {
  if (!isOwner) return m.reply(mess.owner);
  if (!text) return m.reply(`*Contoh:* ${cmd} isi pesan`);

  global.textpushkontak = text;

  const groups = await sock.groupFetchAllParticipating();
  if (!groups || Object.keys(groups).length === 0)
    return m.reply("❌ Bot tidak tergabung di grup manapun.");

  global.dataAllGrup = groups;

  const rows = Object.values(groups).map(g => ({
    title: g.subject || "Tanpa Nama",
    description: `👥 ${g.participants.length} member`,
    id: `.pushkontak-response ${g.id}`
  }));

  await sock.sendMessage(m.chat, {
    text: `📢 *PUSH KONTAK*\n\nSilahkan pilih grup target:`,
    viewOnce: true,
    buttons: [
      {
        buttonId: "select_gc",
        buttonText: { displayText: "📂 Pilih Grup" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "Daftar Grup",
            sections: [
              {
                title: "Pilih Target Grup",
                rows
              }
            ]
          })
        }
      }
    ],
    headerType: 1
  }, { quoted: m });
}
break;

case "pushkontak-response": {
  if (!isOwner) return m.reply(mess.owner);

  if (!global.textpushkontak || !global.dataAllGrup)
    return m.reply(
      "❌ Data pushkontak tidak ditemukan\nSilahkan ulangi dengan *.pushkontak pesan*"
    );

  const groupId = text;
  const groupData = global.dataAllGrup[groupId];
  if (!groupData) return m.reply("❌ Grup tidak ditemukan.");

  const messageText = global.textpushkontak;

  const members = groupData.participants
    .map(v => v.id)
    .filter(jid => jid && jid !== m.botNumber);
  
  global.statusPushkontak = true

  await m.reply(
    `🚀 *Memulai Pushkontak*\n\n` +
    `📌 Grup : *${groupData.subject}*\n` +
    `👥 Total : *${members.length} member*`
  );

  let success = 0;

  for (const jid of members) {
    try {
      if (!global.statusPushkontak) break
      await sock.sendMessage(jid, { text: messageText }, { quoted: qtext });
      success++;
      await sleep(global.jedaPush); // delay aman
    } catch (e) {
      console.log("Gagal kirim ke:", jid);
    }
  }

  delete global.textpushkontak;
  delete global.dataAllGrup;

  return m.reply(
    `✅ *Pushkontak Selesai*\n\n` +
    `📤 Berhasil terkirim ke *${success} member*`
  );
}
break;


case "stoppush": {
if (!isOwner) return m.reply(mess.owner);
if (!global.statusPushkontak) return m.reply("Tidak ada pushkontak yang sedang berjalan!")
global.statusPushkontak = false
return m.reply(`Berhasil menghentikan pushkontak ✅`)
}
break

case "sticker": case "stiker": case "sgif": case "s": {
if (!/image|video/.test(mime)) return m.reply(`*ex:* ${cmd} dengan kirim atau reply image`)
if (/video/.test(mime)) {
if ((qmsg).seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
}
try {
var media = m.quoted ? await m.quoted.download() : await m.download()
await sock.sendSticker(m.chat, media, m, {packname: global.namaOwner})
} catch (err) {
console.log(err)
return m.reply(`Error! gagal convert gambar to sticker.`)
}
}
break

case "tourl": {
    if (!/image/.test(mime)) 
        return m.reply(`*ex:* ${cmd} dengan kirim atau reply image`)
    try {
        let mediaPath = m.quoted ? await m.quoted.download() : await m.download()
        let buffer = mediaPath
        let directLink = await uploadImageBuffer(buffer);
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: `✅ Foto berhasil diupload!\n\nURL: ${directLink}` },
                        nativeFlowMessage: {
                            buttons: [
                                { 
                                    name: "cta_copy", 
                                    buttonParamsJson: `{"display_text":"Copy URL","copy_code":"${directLink}"}`
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: m.sender, quoted: m });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error("Tourl Error:", err);
        m.reply("Terjadi kesalahan saat mengubah media menjadi URL.");
    }
}
break;


case "igdl": case "instagram": case "ig": {
    if (!text) return m.reply(`*ex:* ${cmd} https://www.instagram.com/reel/xxx`)

    try {
        let url = text
        if (!/instagram\.com/.test(text)) return m.reply(`*ex:* ${cmd} https://www.instagram.com/reel/xxx`)
        await m.reply("Downloading instagram, tunggu sebentar...")
        const data = await fetchJson(`https://skyzopedia-api.vercel.app/download/instagram?apikey=skyy&url=${url}`).then(res => res.result)
        const album = []
        if (!data[0]?.url_download) return m.reply("Error! data Instagram tidak ditemukan.")
        for (let i of data) {
        if (/Video/.test(i.kualitas)) {
        await sock.sendMessage(
            m.chat,
            {
                video: { url: i.url_download },
                caption: "Instagram Downloader ✅", 
                mimetype: "video/mp4"
            },
            { quoted: m }
        )
        } else {
        album.push({
                image: { url: i.url_download },
                caption: `Instagram Downloader ✅`
            })
        }
        }
        
        if (album.length > 1) await sock.sendAlbum(
            m.chat,
            { albumMessage: album },
            m
        )

    } catch (err) {
        console.log(err)
        m.reply("Terjadi kesalahan saat mengambil video")
    }
}
break

case "backupsc":
case "bck":
case "backup": {
    if (!isOwner) return m.reply(mess.owner);
    try {        
        const tmpDir = "./sampah";
        if (fs.existsSync(tmpDir)) {
            const files = fs.readdirSync(tmpDir).filter(f => f !== "X");
            for (let file of files) {
                fs.unlinkSync(`${tmpDir}/${file}`);
            }
        }
        await m.reply("Backup Script Bot, Tunggu sebentar...");        
        const name = `${global.botName}-${global.versionBot}`; 
        const exclude = [
            "node_modules",
            "skyzopedia",
            "session",
            "package-lock.json",
            "yarn.lock",
            ".npm",
            ".cache"
        ];
        const allItems = await fs.readdirSync(".", { withFileTypes: true });
        const getFilesRecursive = (dir) => {
            let results = [];
            const list = fs.readdirSync(dir, { withFileTypes: true });
            list.forEach((file) => {
                const fullPath = `${dir}/${file.name}`;
                if (exclude.some(ex => fullPath.startsWith(`./${ex}`) || fullPath.startsWith(`${ex}`))) return; 
                if (file.isDirectory()) {
                    results = results.concat(getFilesRecursive(fullPath));
                } else {
                    results.push(fullPath);
                }
            });
            return results;
        };
        const filesToZip = [];
        allItems.forEach((item) => {
            if (exclude.includes(item.name)) return;
            if (item.isDirectory()) {
                filesToZip.push(item.name);
            } else {
                filesToZip.push(item.name);
            }
        });

        if (!filesToZip.length) return m.reply("Tidak ada file yang dapat di-backup.");
        const excludeArgs = exclude.map(e => `-x "${e}/*"`).join(" ");
        execSync(`zip -r ${name}.zip ${filesToZip.join(" ")} ${excludeArgs}`);

        await sock.sendMessage(m.sender, {
            document: fs.readFileSync(`./${name}.zip`),
            fileName: `${name}.zip`,
            mimetype: "application/zip"
        }, { quoted: m });

        fs.unlinkSync(`./${name}.zip`);

        if (m.chat !== m.sender) m.replyy("Script Bot berhasil dikirim ke Private Chat.");
    } catch (err) {
        console.error("Backup Error:", err);
        m.reply("Terjadi kesalahan saat melakukan backup.");
    }
}
break;

case "tt": case "tiktok": case "ttdl": {
if (!text) return m.reply(`*ex:* ${cmd} https://vt.tiktok.com/xxx/`)
if (!text.startsWith("https://")) return m.reply(`*ex:* ${cmd} https://vt.tiktok.com/xxx/`)
const res = await tiktok(`${text}`)
if (!res.data) return m.reply("Erorr! data result tidak ditemukan.")
await m.reply("Mendownload data link tiktok...")
if (res.data.images && res.data.images.length !== 0) {
let album = []
for (let i of res.data.images) {
album.push({ image: { url: i }, caption: "Tiktok Slide Downloader ✅" })
}
await sock.sendMessage(m.chat, {album: album}, {quoted: m})
} else {
await sock.sendMessage(m.chat, {video: {url: res.data.hdplay || res.result.data.play}, caption: "Tiktok Downloader ✅"}, { quoted: m})
}
if (res.data.music) {
await sock.sendMessage(m.chat, {audio: {url: res.data.music}, mimetype: "audio/mpeg", ptt: false}, {quoted: m})
}
}
break
    
    
  default:
if (m.body.toLowerCase().startsWith("xx ")) {
  if (!isOwner) return;
  try {
    const r = await eval(`(async()=>{${text}})()`);
    sock.sendMessage(m.chat, { text: util.format(typeof r === "string" ? r : util.inspect(r)) }, { quoted: m });
  } catch (e) {
    sock.sendMessage(m.chat, { text: util.format(e) }, { quoted: m });
  }
}

if (m.body.toLowerCase().startsWith("x ")) {
  if (!isOwner) return;
  try {
    let r = await eval(text);
    sock.sendMessage(m.chat, { text: util.format(typeof r === "string" ? r : util.inspect(r)) }, { quoted: m });
  } catch (e) {
    sock.sendMessage(m.chat, { text: util.format(e) }, { quoted: m });
  }
}

if (m.body.startsWith('$ ')) {
  if (!isOwner) return;
  exec(m.body.slice(2), (e, out) =>
    sock.sendMessage(m.chat, { text: util.format(e ? e : out) }, { quoted: m })
  );
}

  }
};


let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
delete require.cache[file]
require(file)
})