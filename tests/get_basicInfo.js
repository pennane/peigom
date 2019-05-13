const path = require('path');
const fs   = require('fs');
const ytdl = require('ytdl-core');
const id  = '7wNb0pHyGuI';

const filepath = path.resolve(__dirname, 'basicinfo.json');

ytdl.getBasicInfo(id, (err, info) => {
  if (err) throw err;
  const json = JSON.stringify(info, null, 2)
  fs.writeFile(filepath, json, err => {
    if (err) throw err;
  });
});