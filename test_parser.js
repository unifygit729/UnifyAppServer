const { parseTex } = require('./tex_parser');
const path = require('path');
const file = path.join('C:\\Work\\AG\\Research Officer_Test_Series', 'HSST_Bot_FL_set_01.tex'); // example file from logs
console.log(parseTex(file));
