const fs = require("fs");

global.owner = "6283164465401"
global.namaOwner = "Skyzopedia"
global.linkOwner = "https://t.me/Xskycode"
global.prefix = ".";
global.botName = "Storebot";
global.versionBot = "v1.0.0"
global.thumbnail = "https://img1.pixhost.to/images/11263/676832893_image.jpg"
global.jedaPushkontak = 6000
global.pairingNumber = "6283164465401"

global.mess = {
  owner: "Fitur ini hanya bisa digunakan oleh *Owner Bot*.",
  premium: "Fitur ini hanya bisa digunakan oleh *User Premium*.",
  group: "Fitur ini hanya dapat digunakan di dalam grup.",
  private: "Fitur ini hanya dapat digunakan di private chat.",
  admin: "Fitur ini hanya bisa digunakan oleh admin grup.",
  botadmin: "Fitur ini hanya dapat digunakan jika bot adalah admin grup.",
};

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
delete require.cache[file]
require(file)
})