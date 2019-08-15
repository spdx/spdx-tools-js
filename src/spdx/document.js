// SPDX-License-Identifier: MIT

import {LICENSE_MAP} from './config';
let creationinfojs = require('./creationinfo');

const hash = require('object-hash');

export class ExternalDocumentRef {
  /*
  External Document References entity that contains the following fields :
    - external_document_id: A unique string containing letters, numbers, '.',
        '-' or '+'.
    - spdx_document_uri: The unique ID of the SPDX document being referenced.
    - check_sum: The checksum of the referenced SPDX document.
  */
  constructor(external_document_id, spdx_document_uri, check_sum) {
    this.external_document_id = external_document_id;
    this.spdx_document_uri = spdx_document_uri;
    this.check_sum = check_sum;
  }

  __eq__(other) {
    return other instanceof ExternalDocumentRef && this.external_document_id === other.external_document_id && this.spdx_document_uri === other.spdx_document_uri && this.check_sum === other.check_sum;
  }

  __lt__(other) {
    return this.external_document_id < other.external_document_id && this.spdx_document_uri < other.spdx_document_uri && this.check_sum < other.check_sum;
  }

  validate(messages) {
    /*
    Validate all fields of the ExternalDocumentRef class and update the
        messages list with user friendly error messages for display.
    */
    messages = this.validate_ext_doc_id(messages);
    messages = this.validate_spdx_doc_uri(messages);
    messages = this.validate_checksum(messages);
    return messages;
  }

  validate_ext_doc_id(messages) {
    if(!this.external_document_id) {
      messages = `${messages} [
          'ExternalDocumentRef has no External Document ID.'
      ]`;
    }
    return messages;
  }

    validate_spdx_doc_uri(messages) {
      if(!this.spdx_document_uri) {
        messages = `${messages} [
            'ExternalDocumentRef has no SPDX Document URI.'
        ]`;
      }
      return messages;
    }


    validate_checksum(messages) {
      if(!this.check_sum) {
        messages = `${messages} ['ExternalDocumentRef has no Checksum.']`;
      }
      return messages;
    }
}

export const _add_parens = (required, text) => {
  /* Add parens around a license expression if `required` is True, otherwise
   return `text` unmodified.
  */
  if(required) return `(${text})`;
  return text;
}

const isArray = (myArray) => {
  return myArray.constructor.toString().indexOf("Array") > -1;
}

export class License {
  constructor(full_name, identifier) {
    this._full_name = full_name;
    this._identifier = identifier;
  }

  from_identifier(cls, identifier) {
    /*
    If identifier exists in config.LICENSE_MAP
        the full_name is retrieved from it. Otherwise
        the full_name is the same as the identifier.
    */
    const license_map_keys = Object.keys(LICENSE_MAP);
    console.log(license_map_keys.length)
    console.log(isArray(license_map_keys))
    if(license_map_keys.includes(identifier)) {
      return cls(LICENSE_MAP[identifier], identifier);
    } else {
      return cls(identifier, identifier);
    }
  }

  from_full_name(cls, full_name) {
    /*
    Return a new License for a full_name. If the full_name exists in
        config.LICENSE_MAP the identifier is retrieved from it.
        Otherwise the identifier is the same as the full_name.
    */
    if(Object.keys(LICENSE_MAP).includes(full_name)) {
      return cls(full_name, LICENSE_MAP[full_name]);
    } else {
      return cls(full_name, full_name);
    }
  }

  url() {
    return `http://spdx.org/licenses/{this.identifier}`;
  }

  full_name() {
    return this._full_name;
  }

  identifier() {
    return this._identifier;
  }

  set_full_name(value) {
    this._full_name = value;
  }

  __eq__(other) {
    return other instanceof License && this.identifier === other.identifier && this.full_name === other.full_name;
  }

  __lt__(other) {
    return other instanceof License && this.identifier < other.identifier;
  }

  __str__() {
    return this.identifier;
  }

  __hash__() {
    return hash(this.identifier);
  }
}

export class LicenseConjunction extends License {
  // A conjunction of two licenses.
  constructor(license_1, license_2) {
    super();
    this.license_1 = license_1;
    this.license_2 = license_2;
  }

  full_name() {
    license_1_complex = typeof this.license_1 == "LicenseDisjunction";
    license_2_complex = typeof this.license_2 == "LicenseDisjunction";

    return `${_add_parens(license_1_complex, self.license_1.full_name)} AND ${_add_parens(license_2_complex, self.license_2.full_name)}`
  }

  identifier() {
    license_1_complex = typeof this.license_1 == "LicenseDisjunction";
    license_2_complex = typeof this.license_2 == "LicenseDisjunction";

    return `${_add_parens(license_1_complex, self.license_1.identifier)} AND ${_add_parens(license_2_complex, self.license_2.identifier)}`
  }
}

export class LicenseDisjunction extends License {
  // A disjunction of two licenses.
  constructor(license_1, license_2) {
    super();
    this.license_1 = license_1;
    this.license_2 = license_2;
  }

  full_name() {
    license_1_complex = typeof this.license_1 == "LicenseDisjunction";
    license_2_complex = typeof this.license_2 == "LicenseDisjunction";

    return `${_add_parens(license_1_complex, self.license_1.full_name)} OR ${_add_parens(license_2_complex, self.license_2.full_name)}`
  }

  identifier() {
    license_1_complex = typeof this.license_1 == "LicenseDisjunction";
    license_2_complex = typeof this.license_2 == "LicenseDisjunction";

    return `${_add_parens(license_1_complex, self.license_1.identifier)} OR ${_add_parens(license_2_complex, self.license_2.identifier)}`
  }
}

export class ExtractedLicense extends License {
  /*
  Represent an ExtractedLicense with its additional attributes:
    - text: Extracted text, str. Mandatory.
    - cross_ref: list of cross references.
    - comment: license comment, str.
    - full_name: license name. str or utils.NoAssert.
  */
  constructor(identifier) {
    super();
    this.text = null;
    this.cross_ref = [];
    this.comment = null;
  }

  __eq__(other) {
    return other instanceof ExtractedLicense && this.identifier === other.identifier && this.full_name === other.full_name;
  }

  __lt__(other) {
    return other instanceof ExtractedLicense && this.identifier < other.identifier && this.full_name < other.full_name;
  }

  add_xref(ref) {
    this.cross_ref.push(ref);
  }

  validate(messages) {
    if(!this.text){
      messages = `${messages} ['ExtractedLicense text can not be None']`;
    }
    return messages;
  }

}


export class Document {
  /*
  Represent an SPDX document with these fields:
    - version: Spec version. Mandatory, one - Type: Version.
    - data_license: SPDX-Metadata license. Mandatory, one. Type: License.
    - name: Name of the document. Mandatory, one. Type: str.
    - spdx_id: SPDX Identifier for the document to refer to itself in
      relationship to other elements. Mandatory, one. Type: str.
    - ext_document_references: External SPDX documents referenced within the
        given SPDX document. Optional, one or many. Type: ExternalDocumentRef
    - comment: Comments on the SPDX file, optional one. Type: str
    - namespace: SPDX document specific namespace. Mandatory, one. Type: str
    - creation_info: SPDX file creation info. Mandatory, one. Type: CreationInfo
    - package: Package described by this document. Mandatory, one. Type: Package
    - extracted_licenses: List of licenses extracted that are not part of the
      SPDX license list. Optional, many. Type: ExtractedLicense.
    - reviews: SPDX document review information, Optional zero or more.
      Type: Review.
    - annotations: SPDX document annotation information, Optional zero or more.
      Type: Annotation.
  */
  constructor(version, data_license, name, spdx_id, namespace, comment, package_) {
    this.version = version;
    this.data_license = data_license;
    this.name = name;
    this.spdx_id = spdx_id;
    this.ext_document_references = [];
    this.comment = comment;
    this.namespace = namespace;
    this.creation_info = new creationinfojs.CreationInfo();
    this.package_ = package_;
    this.extracted_licenses = [];
    this.reviews = [];
    this.annotations = [];
  }

  add_review(review) {
    this.reviews.push(review);
  }

  add_annotation(annotation) {
    this.annotations.push(annotation);
  }

  add_extr_lic(lic) {
    this.extracted_licenses.push(lic)
  }

  add_ext_document_reference(ext_doc_ref) {
    this.ext_document_references.push(ext_doc_ref)
  }

  get_files() {
    return this.package_.files;
  }

  set_files(value) {
    this.package_.files = value;
  }

  has_comment() {
    return this.comment ? true : false;
  }

  validate(messages) {
    /*
    Validate all fields of the document and update the
    messages list with user friendly error messages for display.
    */
    messages = this.validate_version(messages)
    messages = this.validate_data_lics(messages)
    messages = this.validate_name(messages)
    messages = this.validate_spdx_id(messages)
    messages = this.validate_namespace(messages)
    messages = this.validate_ext_document_references(messages)
    messages = this.validate_creation_info(messages)
    messages = this.validate_package(messages)
    messages = this.validate_extracted_licenses(messages)
    messages = this.validate_reviews(messages)

    return messages;
  }

  validate_version(messages) {
    if(!this.version) {
      messages = `${messages} ['Document has no version.']`
    }
    return messages;
  }

  validate_data_lics(messages) {
    if(!this.data_license) {
      messages = `${messages} ['Document has no data license.']`
    }
    return messages;
  }

  validate_name(messages) {
    if(!this.name) {
      messages = `${messages} ['Document has no name.']`
    }
    return messages;
  }

  validate_namespace(messages) {
    if(!this.namespace) {
      messages = `${messages} ['Document has no namespace.']`
    }
    return messages;
  }

  validate_spdx_id(messages) {
    if(!this.spdx_id) {
      messages = `${messages} ['Document has no SPDX identifier.']`;
    } else {
      if(!this.spdx_id.endsWith('SPDXRef-DOCUMENT')) {
        messages = `${messages} ['Invalid document SPDX identifier value.']`
      }
    }
    return messages;
  }

  validate_ext_document_references(messages) {
    for(let i = 0; i < this.ext_document_references.length; i++) {
      let doc = this.ext_document_references[i];
      if(doc instanceof ExternalDocumentRef) {
        messages = doc.validate(messages);
      } else {
        messages = `${messages} ['External document references must be of the type spdx.document.ExternalDocumentRef and not ${typeof doc}']`;
      }
    }
    return messages;
  }

  validate_reviews(messages) {
    for(let i = 0; i < this.reviews.length; i++) {
      let review = this.reviews[i];
      messages = review.validate(messages)
    }
    return messages;
  }

  validate_annotations(messages) {
    for(let i = 0; i < this.annotations.length; i++) {
      let annotation = this.annotations[i];
      messages = annotation.validate(messages)
    }
    return messages;
  }

  validate_creation_info(messages) {
    if(this.creation_info) {
      messages = this.creation_info.validate(messages)
    } else {
      messages = `${messages} ['Document has no creation information.']`;
    }
  }

  validate_package(messages) {
    if(this.package_) {
      messages = this.package_.validate(messages)
    } else {
      messages = `${messages} ['Document has no package.']`;
    }
  }

  validate_extracted_licenses(messages) {
    for(let i = 0; i < this.extracted_licenses.length; i++) {
      let lic = this.extracted_licenses[i];
      if(lic instanceof ExtractedLicense) {
        messages = lic.validate(messages);
      } else {
        messages = `${messages} ['Document extracted licenses must be of type spdx.document.ExtractedLicense and not ${typeof lic}']`;
      }
    }
    return messages;
  }
}

module.exports = {
  ExternalDocumentRef : ExternalDocumentRef,
  License : License,
  LicenseConjunction : LicenseConjunction,
  LicenseDisjunction : LicenseDisjunction,
  ExtractedLicense : ExtractedLicense,
  Document : Document
}
