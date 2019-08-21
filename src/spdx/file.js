// SPDX-License-Identifier: MIT

import {LICENSE_MAP} from './config';
const utilsjs = require('./utils');
const documentjs = require('./document');
import {max} from './utils';

const hash = require('object-hash');

export class SpdxFileType {
  constructor() {
    const SOURCE = 1;
    const BINARY = 2;
    const ARCHIVE = 3;
    const OTHER = 4;
    this.SOURCE = SOURCE;
    this.BINARY = BINARY;
    this.ARCHIVE = ARCHIVE;
    this.OTHER = OTHER;
  }
}

export class SpdxFile {
  /*
  Represent an SPDX file.
    Fields:
    - name: File name, str mandatory one.
    - spdx_id: Uniquely identify any element in an SPDX document which may be
    referenced by other elements. Mandatory, one. Type: str.
    - comment: File comment str, Optional zero or one.
    - type: one of FileType.SOURCE, FileType.BINARY, FileType.ARCHIVE
      and FileType.OTHER, optional zero or one.
    - chk_sum: SHA1, Mandatory one.
    - conc_lics: Mandatory one. document.License or utils.new utilsjs.NoAssert or utils.new utilsjs.SPDXNone.
    - licenses_in_file: list of licenses found in file, mandatory one or more.
      document.License or utils.new utilsjs.SPDXNone or utils.new utilsjs.NoAssert.
    - document.license or utils.new utilsjs.NoAssert or utils.new utilsjs.SPDXNone.
    - license_comment: Optional.
    - copyright: Copyright text, Mandatory one. utils.new utilsjs.NoAssert or utils.new utilsjs.SPDXNone or str.
    - notice: optional One, str.
    - contributors: List of strings.
    - dependencies: list of file locations.
    - artifact_of_project_name: list of project names, possibly empty.
    - artifact_of_project_home: list of project home page, possibly empty.
    - artifact_of_project_uri: list of project uris, possibly empty.

  */
  constructor(name, spdx_id, chk_sum) {
    this.name = name;
    this.spdx_id = spdx_id;
    this.comment = null;
    this.type = null;
    this.chk_sum = chk_sum;
    this.conc_lics = null;
    this.licenses_in_file = [];
    this.license_comment = null;
    this.copyright = null;
    this.notice = null;
    this.contributors = [];
    this.dependencies = [];
    this.artifact_of_project_name = [];
    this.artifact_of_project_home = [];
    this.artifact_of_project_uri = [];
  }

  __eq__(other) {
    return other instanceof SpdxFile && this.name === other.name;
  }

  __lt__(other) {
    return this.name < other.name;
  }

  add_lics(lics) {
    this.licenses_in_file.push(lics);
  }


  add_contrib(contrib) {
    this.contributors.push(contrib);
  }

  add_depend(depend){
    this.dependencies.push(depend);
  }


  add_artifact(symbol, value){
    // Add value as artifact_of_project{symbol}.
    symbol = `artifact_of_project_${symbol}`;
    // @TODO: Fix this
    // artifact = getattr(self, symbol);
    // artifact.push(value);
  }

  validate(messages) {
    /*
    Validates the fields and appends user friendly messages
    to messages parameter if there are errors.
    */
    messages = this.validate_concluded_license(messages);
    messages = this.validate_type(messages);
    messages = this.validate_checksum(messages);
    messages = this.validate_licenses_in_file(messages);
    messages = this.validate_copyright(messages);
    messages = this.validate_artifacts(messages);
    messages = this.validate_spdx_id(messages);
    return messages;
  }


  validate_spdx_id(messages) {
    if(!this.spdx_id) {
      messages = `${messages} [
          'File has no SPDX identifier..'
      ]`;
    }
    return messages;
  }


  validate_copyright(messages) {
    if(!(this.copyright instanceof String || this.copyright instanceof new utilsjs.NoAssert || this.copyright instanceof new utilsjs.SPDXNone)) {
      messages = `${messages} [
          'File copyright must be str or unicode or utils.new utilsjs.NoAssert or utils.new utilsjs.SPDXNone'
      ]`;
    }
    return messages;
  }


  validate_artifacts(messages) {
    if(this.artifact_of_project_home.length < max(this.artifact_of_project_uri.length, this.artifact_of_project_name.length)){
      messages = `${messages} + [
          'File must have as much artifact of project as uri or homepage']`;
    }
    return messages;
  }


  validate_licenses_in_file(messages) {
     // FIXME: what are we testing the length of a list? or?
    if(this.licenses_in_file.length === 0) {
      messages = `${messages} + [
          'File must have at least one license in file.'
      ]`;
    }
    return messages;
  }


  validate_concluded_license(messages) {
    // FIXME: use isinstance instead??
    if(!(this.conc_lics instanceof documentjs.License || this.conc_lics instanceof new utilsjs.NoAssert || this.conc_lics instanceof new utilsjs.SPDXNone)) {
        messages = `${messages} + ['File concluded license must be one of document.License, utils.new utilsjs.NoAssert or utils.new utilsjs.SPDXNone']`;
      }
    return messages;
  }


  validate_type(messages) {
    if(!([null, SpdxFileType.SOURCE, SpdxFileType.OTHER, SpdxFileType.BINARY, SpdxFileType.ARCHIVE].includes(this.type))) {
      messages = `${messages} + ['File type must be one of the constants defined in class spdx.file.FileType']`;
    }
    return messages;
  }


  validate_checksum(messages) {
    if(!(this.chk_sum instanceof checksum.Algorithm)) {
      messages = `${messages} + ['File checksum must be instance of spdx.checksum.Algorithm']`;
    } else if(this.chk_sum.identifier === 'SHA1') {
      messages = `${messages} + ['File checksum algorithm must be SHA1']`;
    }
      return messages;
    }


    calc_chksum() {
      const BUFFER_SIZE = 65536;
      let file_handle = fs.readFileSync(this.name, 'utf8');
      return hash(file_handle);
    }


  has_optional_field(field) {
    // @TODO Fix this
    // return getattr(self, field, None) is not None
    return false;
  }
}

module.exports = {
  SpdxFileType : SpdxFileType,
  SpdxFile : SpdxFile,
}
