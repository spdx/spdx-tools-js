// SPDX-License-Identifier: MIT

import {tokens, gen_tokenizer} from './spdx/utils';
import Algorithm from './spdx/checksum';
const moo = require('moo');

const printMsg = () => {
  const txt = "Javascript (tools) python. 1.9 and BSD-3.4";
  console.log(txt);
  // const tknizer = gen_tokenizer().tokenize(txt);
  console.log(tokens);
  // console.log(tknizer);
  const new_algo = new Algorithm("ID1", "VAL1");
  console.log(new_algo.to_tv())
  let lexer = moo.compile({
      WS:      /[ \t]+/,
      comment: /\/\/.*?$/,
      number:  /0|[1-9][0-9]*/,
      string:  /"(?:\\["\\]|[^\n"\\])*"/,
      lparen:  '(',
      rparen:  ')',
      keyword: ['while', 'if', 'else', 'moo', 'cows', '<text>'],
      NL:      { match: /\n/, lineBreaks: true },
      string99:  /(?:^|\s)text(?:\s|$)/,
    })
  lexer.reset("while <text> (10) cows\nmoo")
  console.log(lexer)
  console.log(lexer.next())
  console.log(lexer.next())
  console.log(lexer.next())
  console.log(lexer.next())
  console.log(lexer.next())
  process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
console.log(process.argv.length)
}

exports.printMsg = printMsg();
