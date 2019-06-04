import {tokens, gen_tokenizer} from './utils/general';

const printMsg = () => {
  const txt = "Javascript (tools) python. 1.9 and BSD-3.4";
  console.log(txt);
  const tknizer = gen_tokenizer().tokenize(txt);
  console.log(tokens);
  console.log(tknizer);
}

exports.printMsg = printMsg();
