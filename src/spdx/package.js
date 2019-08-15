// SPDX-License-Identifier: MIT

import {LICENSE_MAP} from './config';
import NoAssert from './utils';
import SPDXNone from './utils';
import {max} from './utils';
import License from './document';
import Creator from './creationinfo';
import Algorithm from './checksum';

const hash = require('object-hash');

export class Package {
  /*
  Represent an analyzed Package.
    Fields:
     - name : Mandatory, string.
     - version: Optional, string.
     - file_name: Optional, string.
     - supplier: Optional, Organization or Person or NO_ASSERTION.
     - originator: Optional, Organization or Person.
     - download_location: Mandatory, URL as string.
     - homepage: Optional, URL as string or NONE or NO_ASSERTION.
     - verif_code: Mandatory string.
     - check_sum: Optional , spdx.checksum.Algorithm.
     - source_info: Optional string.
     - conc_lics: Mandatory spdx.document.License or spdx.utils.SPDXNone or
     - spdx.utils.NoAssert.
     - license_declared : Mandatory spdx.document.License or spdx.utils.SPDXNone or
     - spdx.utils.NoAssert.
     - license_comment  : optional string.
     - licenses_from_files: list of spdx.document.License or spdx.utils.SPDXNone or
     - spdx.utils.NoAssert.
     - cr_text: Copyright text, string , utils.NoAssert or utils.SPDXNone. Mandatory.
     - summary: Optional str.
     - description: Optional str.
     - files: List of files in package, atleast one.
     - verif_exc_files : list of file names excluded from verification code or None.
  */
  constructor(name, download_location, version,
              file_name, supplier, originator) {
    this.name = name;
    this.version = version;
    this.file_name = file_name;
    this.supplier = supplier;
    this.originator = originator;
    this.download_location = download_location;
    this.homepage = null;
    this.verif_code = null;
    this.check_sum = null;
    this.source_info = null;
    this.conc_lics = null;
    this.license_declared = null;
    this.license_comment = null;
    this.licenses_from_files = [];
    this.cr_text = null;
    this.summary = null;
    this.description = null;
    this.files = [];
    this.verif_exc_files = [];
  }

  add_file(fil) {
    this.files.push(fil);
  }

  add_lics_from_file(lics) {
    this.license_from_files.push(lics);
  }

  add_exc_file(filename) {
    this.verif_exc_files.push(filename);
  }


  validate(messages) {
    /*
    Validate the package fields.
    Append user friendly error messages to the `messages` list.
    */
    messages = this.validate_checksum(messages);
    messages = this.validate_optional_str_fields(messages);
    messages = this.validate_mandatory_str_fields(messages);
    messages = this.validate_files(messages);
    messages = this.validate_mandatory_fields(messages);
    messages = this.validate_optional_fields(messages);
    return messages;
  }

  validate_optional_fields(messages) {
    if(this.originator && (this.originator instanceof NoAssert || this.originator instanceof Creator)) {
      messages = `${messages} [Package originator must be instance of spdx.utils.NoAssert or spdx.creationinfo.Creator]`;
    }
    if(this.supplier && (this.supplier instanceof NoAssert || this.supplier instanceof Creator)) {
      messages = `${messages} [Package supplier must be instance of spdx.utils.NoAssert or spdx.creationinfo.Creator]`;
    }
    return messages;
  }


  validate_mandatory_fields(mssages) {
    if(!(this.conc_lics instanceof SPDXNone || this.conc_lics instanceof NoAssert || this.conc_lics instanceof License)) {
      messages = `${messages} [Package concluded license must be instance of spdx.utils.SPDXNone or spdx.utils.NoAssert or spdx.document.License]`;
    }
    if(!(this.license_declared instanceof SPDXNone || this.license_declared instanceof NoAssert || this.license_declared instanceof License)) {
      messages = `${messages} [Package declared license must be instance of spdx.utils.SPDXNone or spdx.utils.NoAssert or spdx.document.License]`;
    }
    // #TODO: Complete this
    if(!this.licenses_from_files) {
      messages = `${messages} [Package licenses_from_files can not be empty]`;
    }
    return messages;
  }

  validate_files(messages) {
    if(!this.files) {
      messages = `${messages} [Package must have at least one file]`;
    } else {
      for(let i = 0; i < this.files.length; i++) {
        messages = this.files[i].validate(messages);
      }
    }
    return messages;
  }


  validate_optional_str_fields(messages) {
    /*
    Fields marked as optional and of type string in class
        docstring must be of a type that provides __str__ method.
    */
    const FIELDS = [
            'file_name',
            'version',
            'homepage',
            'source_info',
            'summary',
            'description'
        ];
    messages = this.validate_str_fields(FIELDS, true, messages);
    return messages;
  }


  validate_mandatory_str_fields(messages) {
    /*
    Fields marked as Mandatory and of type string in class
    docstring must be of a type that provides __str__ method.
    */
    const FIELDS = ['name', 'download_location', 'verif_code', 'cr_text'];
    messages = this.validate_str_fields(FIELDS, false, messages);

    return messages;
  }


  validate_str_fields(messages) {
    /*
    Helper for validate_mandatory_str_field and
        validate_optional_str_fields
    */
    // #TODO: Complete this
    return messages;
  }


  validate_checksum(messages) {
    if(!(this.check_sum instanceof Algorithm)) {
      messages = `${messages} [Package checksum must be instance of spdx.checksum.Algorithm]`;
    } else if(this.check_sum.identifier !== 'SHA1') {
      messages = `${messages} [File checksum algorithm must be SHA1]`;
    }
    return messages;
  }


  calc_verif_code() {
    // TODO: Complete this
    return '';
  }


  has_optional_field(field) {
    // TODO: Complete this
  }
}

module.exports = {
  Package : Package,
}
