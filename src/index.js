// SPDX-License-Identifier: MIT

const documentjs = require('./spdx/document');
const creationinfojs = require('./spdx/creationinfo');
const packagejs = require('./spdx/package');
const filejs = require('./spdx/file');
const utilsjs = require('./spdx/utils');
const path = require('path');
import {tokens, gen_tokenizer} from './spdx/utils';
import Algorithm from './spdx/checksum';
import {write_document} from './spdx/writers/tagvalue';
// import Document  from './spdx/document';
// import License from './spdx/document';
import Version from './spdx/version';
const moo = require('moo');

const printMsg = () => {
  const txt = "Javascript (tools) python. 1.9 and BSD-3.4";
  console.log(txt);
  // const tknizer = gen_tokenizer().tokenize(txt);
  // console.log(tokens);
  // console.log(tknizer);
  // const new_algo = new Algorithm("ID1", "VAL1");
  // console.log(new_algo.to_tv())
  // let lexer = moo.compile({
  //     WS:      /[ \t]+/,
  //     comment: /\/\/.*?$/,
  //     number:  /0|[1-9][0-9]*/,
  //     string:  /"(?:\\["\\]|[^\n"\\])*"/,
  //     lparen:  '(',
  //     rparen:  ')',
  //     keyword: ['while', 'if', 'else', 'moo', 'cows', '<text>'],
  //     NL:      { match: /\n/, lineBreaks: true },
  //     string99:  /(?:^|\s)text(?:\s|$)/,
  //   })
  // lexer.reset("while <text> (10) cows\nmoo")
  // console.log(lexer)
  // console.log(lexer.next())
  // console.log(lexer.next())
  // console.log(lexer.next())
  // console.log(lexer.next())
  // console.log(lexer.next())
  // process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
// });
// console.log(process.argv.length)
}

exports.printMsg = printMsg();
console.log("START")

const license_fxt = (item1, item2) => {
  return [item1, item2];
}
const version = new Version(2, 1)
const license = new documentjs.License()
const license_from_id = license.from_identifier(license_fxt, 'CC0-1.0')
const doc = new documentjs.Document(version, license)
doc.comment = "notice"
const tool_name = 'SPDX JS'
const tool_version = "1.0"
const tool = new creationinfojs.Tool(tool_name + ' ' + tool_version);
doc.creation_info.add_creator(tool)
doc.creation_info.set_created_now()
doc.add_extr_lic("spdx license")
console.log(doc)
const input_path = "~/Desktop/pn/spdx-tools-js"
const package_ = doc.package = new packagejs.Package(
      path.basename(input_path), new utilsjs.NoAssert()
  )
package_.cr_text = "Copyright"
package_.add_lics_from_file("spdx license")
console.log(package_)

// simulate the creation of just one file
const file_name = "File name"
const file_entry = new filejs.SpdxFile(
        file_name,
        "",
        new Algorithm('SHA1', '')
    )
file_entry.add_lics("spdx license")
file_entry.add_lics(new utilsjs.NoAssert())
file_entry.conc_lics = new utilsjs.NoAssert()
file_entry.copyright = new utilsjs.NoAssert()
package_.add_file(file_entry)
package_.verif_code = doc.package.calc_verif_code()
package_.license_declared = new utilsjs.NoAssert()
package_.conc_lics = new utilsjs.NoAssert()
console.log(package_.files.length)
console.log(file_entry)
if(package_.files) {
  const spdx_output = "doc.spdx"
  write_document(doc, spdx_output, false)
}
