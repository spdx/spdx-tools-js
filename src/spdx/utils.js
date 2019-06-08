import moment from 'moment';
const lexr = require('lexr');
const Lexer = require("lex");

export const datetime_iso_format = (dateTime) => {
  // Return an ISO-8601 representation of a datetime object.
  return moment(dateTime).toISOString()
}

export class NoAssert {
  // Represent SPDX NOASSERTION value.
  to_value() {
    return 'NOASSERTION';
  }

  toString() {
    return this.to_value();
  }
}

export class UnKnown {
  // Represent SPDX UNKNOWN value.
  to_value() {
    return 'NOASSERTION';
  }

  toString() {
    return this.to_value();
  }
}

export class SPDXNone {
  // Represent SPDX None value.
  to_value() {
    return 'NONE';
  }

  toString() {
    return this.to_value();
  }
}

export const max = (item1, item2) => {
  if(item2 > item1) {
    return item2;
  }
  if(item2 < item1) {
    return item1;
  }
  return null;
}

// TOKENIZER

export const tokens = {
  LP : /[(]/,
  RP : /[)]/,
  AND : /and|AND/g,
  OR : /or|OR/g,
  LICENSE : /[A-Za-z.0-9\-+]+/,
};

export const gen_tokenizer = () => {
  let tokenizer = new lexr.Tokenizer("");
  const tokens = {
    LP : /[(]/,
    RP : /[)]/,
    AND : /and|AND/,
    OR : /or|OR/,
    LICENSE : /[A-Za-z.0-9\-+]+/,
  };
  tokenizer.addTokenSet(tokens);
  tokenizer.ignoreWhiteSpace();
  tokenizer.ignoreNewLine();
  return tokenizer;
}

// exports.tokenizer = tokenizer();


//  LEXERS
export const lp_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/[(]/g, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}

export const rp_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/[)]/g, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}

export const and_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/and|AND/g, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}

export const or_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/or|OR/g, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}

export const whitespace_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/^\s+$/, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}

export const license_lexer = (lexer_input) => {
  var lexer = new Lexer;

  lexer.addRule(/[A-Za-z.0-9\-+]+/, function (lexeme) {
      console.log(lexeme);
  });

  lexer.setInput(lexer_input);

  lexer.lex();
}


// PARSER UTILS
export const license_conjunction = (license1, license2) => {
  if(license1 === license2) {
    return `{license1} AND {license2}`;
  }
  return undefined;
}

export const license_disjunction = (license1, license2) => {
  if(license1 === license2) {
    return `{license1} OR {license2}`;
  }
  return undefined;
}

export const get_token_list = () => {
  // TODO: Complete this method
  return [];
}

// PARSERS
export const disjunction_parser_1 = (token_list) => {
  return license_disjunction(token_list[1], token_list[3]);
}

export const disjunction_parser_2 = (token_list) => {
  return token_list[1];
}

export const conjunction_parser_1 = (token_list) => {
  return license_conjunction(token_list[1], token_list[3]);
}

export const conjunction_parser_2 = (token_list) => {
  return token_list[1];
}

export const license_parser_1 = (token_list) => {
  return token_list[1];
}

export const license_parser_2 = (token_list) => {
  return token_list[2];
}

// export { tokenizer };
