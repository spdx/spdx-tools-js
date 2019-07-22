// SPDX-License-Identifier: MIT

import StandardLogger from './parsers/loggers';
import Parser from './parsers/tagvaluebuilder';
import Builder from './parsers/loggers';
import write_document from './writers/rdf';


export const tv_to_rdf = (infile_name, outfile_name) => {
  /*
  Convert a SPDX file from tag/value format to RDF format.
    Return True on sucess, False otherwise.
  */
}

const runLib = () => {
  const cmdArguments = process.argv;
  cmdArguments.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
  console.log(cmdArguments.length)
  if(cmdArguments.length < 3) {
    console.log(
            'Usage: spdx-tv2rdf <tag-value-file> <rdf-file> Convert an SPDX tag/value document to RDF.'
        )
  }
  const tvfile = cmdArguments[2]
  const rdffile = cmdArguments[3]
  const success = tv_to_rdf(tvfile, rdffile)
}
