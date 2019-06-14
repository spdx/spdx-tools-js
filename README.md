# Javascript equivalent of [SPDX's python-tools](https://github.com/spdx/tools-python)


The Software Package Data Exchange (SPDX) specification is a standard format for
communicating the components, licenses and copyrights associated with a software
package.
The goal is to accompany software with special files that hold certain meta information:
authorship, copyrights, licenses, etc. A JavaScript library for parsing, validating and creating
SPDX documents will go a long way in complimenting the existing Java, Python and GO
libraries and to ease the integration of SPDX specifications in project that are build on
JavaScript frameworks such as NodeJs, ReactJs e.t.c.


The JavaScript Library will be inspired by the work that has been done already on the
Python and/or Java libraries. The implementation would most comprise of porting existing
design and code implementation of the Python and/or Java libraries. The diagram below
2
reveals the full architecture of SPDX v2.1 Document Specification which is the most
supported and stable version.


The SPDX Java library implements all the aspects and recommendations suggested in the
architecture exposing users with the following functions :
- TagToSpreadsheet - Convert a tag format input file to a spreadsheet output file
- TagToRDF - Convert a tag format input file to an RDF format output file
- RdfToTag - Convert an RDF format input file to a tag format output file
- RdfToHtml - Convert an RDF format input file to an HTML web page output file
3
- RdfToSpreadsheet - Convert an RDF format input file to a spreadsheeet format
output file
- SpreadsheetToRDF - Convert a spreadsheet input file to an RDF format output file
- SpreadsheetToTag - Convert a spreadsheet input file to a tag format output file
- SPDXViewer - Display an SPDX document input file (in either tag/value or RDF
format)
- CompareMultipleSpdxDocs - Compare multiple SPDX documents (in either tag/value
or RDF formats) and output to a spreadsheet
- CompareSpdxDocs - Compare two SPDX documents (in either tag/value or RDF
format)
- GenerateVerificationCode - Geneinkrate a Verification Code from a directory of files.
