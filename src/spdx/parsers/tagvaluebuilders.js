// SPDX-License-Identifier: MIT

import Algorithm from '../checksum';
import SPDXValueError from './builderexceptions'
import CardinalityError from './builderexceptions'
import OrderError from './builderexceptions'
import Tool from '../creationinfo'
import {validate_org_name, validate_review_comment, validate_person_name, validate_creator,
        validate_creation_comment, validate_reviewer, validate_annotator, validate_pkg_desc,
        validate_pkg_cr_text, validate_pkg_lics_comment, validate_lics_conc, validate_pkg_homepage,
        validate_pkg_supplier, validate_pkg_src_info, validate_file_notice, validate_file_copyright,
        validate_file_lics_comment, validate_file_lics_in_file, validate_file_comment,
        validate_file_spdx_id, validate_snip_lics_info, validate_snip_file_spdxid} from './validations'
import datetime_from_iso_format from '../utils'
import Version from '../version'
import Review from '../review'
import Annotation from '../annotation'
import Package from '../package';
import SpdxFileType from '../file';


import Organization from '../creationinfo';
import Document from '../document';
import License from '../document';
import SPDXNone from '../utils';
import NoAssert from '../utils';

export const checksum_from_sha1 = (value) => {
  /*
  Return an spdx.checksum.Algorithm instance representing the SHA1
    checksum or None if does not match CHECKSUM_RE.
    */
  let regex = /'SHA1:\s*([\S]+)'/;
  let match = regex.exec(value);
  if(match) {
    return Algorithm(identifier='SHA1', value=match[1]);
  } else {
    return null;
  }
}

export const str_from_text = (text) => {
  /*
  Return content of a free form text block as a string.
  */
  let regex = /'<text>((.|\n)+)<\/text>'/;
  let match = regex.exec(value);
  if(match) {
    return match[1];
  } else {
    return null;
  }
}

export class DocBuilder {
  /*
  Responsible for setting the fields of the top level document model.
  */

  constructor() {
    const VERS_STR_REGEX = /'SPDX-(\d+)\.(\d+)'/;
    this.reset_document();
  }

  set_doc_version(doc, value) {
    /*
    Set the document version.
        Raise SPDXValueError if malformed value, CardinalityError
        if already defined
        */
    if(!(this.doc_version_set)) {
      this.doc_version_set = true;
      let m = this.VERS_STR_REGEX.exec(value);
      if(m === null) {
        // @TODO: Correct this
        return SPDXValueError('Document::Version');
      } else {
        doc.version = Version(major=parseInt(m[1]), minor=parseInt(m[2]));
        return true;
      }
    } else {
      return CardinalityError('Document::Version');
    }
  }

  set_doc_data_lics(doc, lics) {
    /*
    Sets the document data license.
        Raises value error if malformed value, CardinalityError
        if already defined.
        */
    if(!(this.doc_data_lics_set)) {
      this.doc_data_lics_set = true;
      if(validate_data_lics(lics)) {
        doc.data_license = License.from_identifier(lics);
        return true;
      } else {
        return SPDXValueError('Document::DataLicense');
      }
    } else {
      return CardinalityError('Document::DataLicense')
    }
  }

  set_doc_name(doc, name) {
    /*
    Sets the document name.
        Raises CardinalityError if already defined.
        */
    if(!(this.doc_name_set)) {
      doc.name = name;
      this.doc_name_set = true;
      return true;
    } else {
      return CardinalityError('Document::Name')
    }
  }

  set_doc_spdx_id(doc, doc_spdx_id_line) {
    /*
    Sets the document SPDX Identifier.
        Raises value error if malformed value, CardinalityError
        if already defined.
        */
    if(!(this.doc_spdx_id_set)) {
      if(doc_spdx_id_line === 'SPDXRef-DOCUMENT') {
        doc.spdx_id = doc_spdx_id_line;
        this.doc_spdx_id_set = true;
        return true;
      } else {
        return SPDXValueError('Document::SPDXID');
      }
    } else {
      return CardinalityError('Document::SPDXID');
    }
  }

  set_doc_comment(doc, comment) {
    /*
    Sets document comment, Raises CardinalityError if
        comment already set.
        Raises SPDXValueError if comment is not free form text.
        */
    if(!(this.doc_comment_set)) {
      this.doc_comment_set = true;
      if(validate_doc_comment(comment)) {
        doc.comment = str_from_text(comment);
        return true;
      } else {
        return SPDXValueError('Document::Comment');
      }
    } else {
      return CardinalityError('Document::Comment')
    }
  }

  set_doc_namespace(doc, namespace) {
    /*
    Sets the document namespace.
        Raise SPDXValueError if malformed value, CardinalityError
        if already defined.
        */
    if(!(this.doc_namespace_set)) {
      this.doc_namespace_set = true;
      if(validate_doc_namespace(namespace)) {
        doc.namespace = namespace;
        return true;
      } else {
        return SPDXValueError('Document::Namespace')
      }
    } else {
      return CardinalityError('Document::Namespace');
    }
  }

  reset_document() {
    // Resets the state to allow building new documents
    this.doc_version_set = false
    this.doc_comment_set = false
    this.doc_namespace_set = false
    this.doc_data_lics_set = false
    this.doc_name_set = false
    this.doc_spdx_id_set = false
  }
}

export class ExternalDocumentRefBuilder {
  constructor() {

  }

  set_ext_doc_id(doc, ext_doc_id) {
    /*
    Sets the `external_document_id` attribute of the `ExternalDocumentRef`
        object.
        */
    doc.add_ext_document_reference(ExternalDocumentRef(external_document_id=ext_doc_id));
  }

  set_spdx_doc_uri(doc, spdx_doc_uri) {
    /*
    Sets the `spdx_document_uri` attribute of the `ExternalDocumentRef`
        object.
        */
    if(validate_doc_namespace(spdx_doc_uri)) {
      doc.ext_document_references[doc.ext_document_references.length - 1].spdx_document_uri = spdx_doc_uri;
    } else {
      return SPDXValueError('Document::ExternalDocumentRef');
    }
  }

  set_chksum(doc, chksum) {
    /*
    Sets the `check_sum` attribute of the `ExternalDocumentRef`
        object.
        */
    doc.ext_document_references[doc.ext_document_references.length - 1].check_sum = checksum_from_sha1(
            chksum)
  }

  add_ext_doc_refs(doc, ext_doc_id, spdx_doc_uri, chksum) {
    this.set_ext_doc_id(doc, ext_doc_id);
    this.set_spdx_doc_uri(doc, spdx_doc_uri);
    this.set_chksum(doc, chksum);
  }

}

export class EntityBuilder {
  constructor() {
    this.tool_re = /'Tool:\s*(.+)'/;
    this.person_re = /Person:\s*(([^(])+)(\((.*)\))?'/;
    this.org_re = /'Organization:\s*(([^(])+)(\((.*)\))?'/;
    this.PERSON_NAME_GROUP = 1
    this.PERSON_EMAIL_GROUP = 4
    this.ORG_NAME_GROUP = 1
    this.ORG_EMAIL_GROUP = 4
    this.TOOL_NAME_GROUP = 1
  }

  build_tool(doc, entity) {
    /*
    Builds a tool object out of a string representation.
        Returns built tool. Raises SPDXValueError if failed to extract
        tool name or name is malformed
        */
    let match = this.tool_re.exec(entity);
    if(match && validate_tool_name(match[this.TOOL_NAME_GROUP])) {
      let name = match[this.TOOL_NAME_GROUP];
      return Tool(name);
    } else {
      return SPDXValueError('Failed to extract tool name')
    }
  }

  build_org(doc, entity) {
    /*
    Builds an organization object of of a string representation.
        Returns built organization. Raises SPDXValueError if failed to extract
        name.

        */
    let match = this.org_re.exec(entity);
    if(match && validate_org_name(match[this.ORG_NAME_GROUP])) {
      let name = match[this.ORG_NAME_GROUP].replace(/\s/g, '');
      let email = match[this.ORG_EMAIL_GROUP];
      if(email !== null && email.length !== 0) {
        return Organization(name=name, email=email.replace(/\s/g, ''));
      } else {
        return Organization(name=name, email=null);
      }
    } else {
      return SPDXValueError('Failed to extract Organization name');
    }
  }

  build_person(doc, entity) {
    /*
    Builds an organization object of of a string representation.
        Returns built organization. Raises SPDXValueError if failed to extract
        name.
        */
    let match = this.person_re.exec(entity);
    if(match && validate_person_name(match[this.PERSON_NAME_GROUP])) {
      let name = match[this.PERSON_NAME_GROUP].replace(/\s/g, '');
      let email = match[this.PERSON_EMAIL_GROUP];
      if(email !== null && email.length !== 0) {
        return Person(name, email.replace(/\s/g, ''));
      } else {
        return Person(name, null);
      }
    } else {
      return SPDXValueError('Failed to extract person name');
    }
  }
}

export class CreationInfoBuilder {
  constructor() {
    // @TODO: FIXME: this state does not make sense
    this.reset_creation_info();
  }

  add_creator(doc, creator) {
    /*
    Adds a creator to the document's creation info.
        Returns true if creator is valid.
        Creator must be built by an EntityBuilder.
        Raises SPDXValueError if not a creator type.
        */
    if(validate_creator(creator)) {
      doc.creation_info.add_creator(creator);
      return true;
    } else {
      return SPDXValueError('CreationInfo::Creator')
    }
  }

  set_created_date(doc, created) {
    /*
    Sets created date, Raises CardinalityError if
        created date already set.
        Raises SPDXValueError if created is not a date.
        */
    if(!(this.created_date_set)) {
      this.created_date_set = true;
      let date = datetime_from_iso_format(created);
      if(date !== null) {
        doc.creation_info.created = date;
        return true;
      } else {
        return SPDXValueError('CreationInfo::Date');
      }
    } else {
      return CardinalityError('CreationInfo::Created');
    }
  }

  set_creation_comment(doc, comment) {
    /*
    Sets creation comment, Raises CardinalityError if
        comment already set.
        Raises SPDXValueError if not free form text.
        */
    if(!(this.creation_comment_set)) {
      this.creation_Comment_set = true;
      if(validate_creation_comment(comment)) {
        doc.creation_info.comment = str_from_text(comment);
        return true;
      } else {
        return SPDXValueError('CreationInfo::Comment');
      }
    } else {
      return CardinalityError('CreationInfo::Comment');
    }
  }

  set_lics_list_ver(doc, value) {
    /*
    Sets the license list version, Raises CardinalityError if
        already set, SPDXValueError if incorrect value.
        */
    if(!this.lics_list_ver_set) {
      this.lics_list_ver_set = true;
      let vers = Version.from_str(value);
      if(vers !== null) {
        doc.creation_info.license_list_version = vers;
        return true;
      } else {
        return  SPDXValueError('CreationInfo::LicenseListVersion');
      }
    } else {
      CardinalityError('CreationInfo::LicenseListVersion');
    }
  }

  reset_creation_info() {
    // Resets builder state to allow building new creation info.
    this.created_date_set = false;
    this.creation_comment_set = false;
    this.lics_list_ver_set = false;
  }
}

export class ReviewBuilder {
  constructor() {
    // @TODO: FIXME: this state does not make sense
    this.reset_reviews();
  }

  reset_reviews() {
    // Resets the builder's state to allow building new reviews.
    this.review_date_set = false
    this.review_comment_set = false
  }

  add_reviewer(doc, reviewer) {
    /*
    Adds a reviewer to the SPDX Document.
        Reviwer is an entity created by an EntityBuilder.
        Raises SPDXValueError if not a valid reviewer type.
        */
    this.reset_reviews();
    if(validate_reviewer(reviewer)) {
      doc.add_review(Review(reviewer=reviewer));
      return true;
    } else {
      return SPDXValueError('Review::Reviewer')
    }
  }

  add_review_date(doc, reviewed) {
    /*
    Sets the review date. Raises CardinalityError if
        already set. OrderError if no reviewer defined before.
        Raises SPDXValueError if invalid reviewed value.
        */
    if(doc.reviews.length !== 0) {
      if(!(this.review_date_set)) {
        this.review_date_set = true;
        let date = datetime_from_iso_format(reviewed);
        if(date !== null) {
          doc.reviews[doc.reviews.length - 1].review_date = date;
          return true;
        } else {
          return SPDXValueError('Review::ReviewDate');
        }
      } else {
        return CardinalityError('Review::ReviewDate');
      }
    } else {
      return OrderError('Review::ReviewDate');
    }
  }

  add_review_comment(doc, comment) {
    /*
    Sets the review comment. Raises CardinalityError if
        already set. OrderError if no reviewer defined before.
        Raises SPDXValueError if comment is not free form text.
        */
    if(doc.reviews.length !== 0) {
      if(!(this.review_comment_set)) {
        this.review_comment_set = true;
        if(validate_review_comment(comment)) {
          doc.reviews[doc.reviews.length - 1].comment = str_from_text(comment);
          return true;
        } else {
          return SPDXValueError('ReviewComment::Comment');
        }
      } else {
        return CardinalityError('ReviewComment');
      }
    } else {
      return OrderError('ReviewComment');
    }
  }
}

export class AnnotationBuilder {
  constructor() {
    //@TODO # FIXME: this state does not make sense
    this.reset_annotations();
  }

  reset_annotations() {
    // Resets the builder's state to allow building new annotations.
    this.annotation_date_set = false;
    this.annotation_comment_set = false;
    this.annotation_type_set = false;
    this.annotation_spdx_id_set = false;
  }

  add_annotator(doc, annotator) {
    /*
    Adds an annotator to the SPDX Document.
    Annotator is an entity created by an EntityBuilder.
    Raises SPDXValueError if not a valid annotator type.

    # Each annotator marks the start of a new annotation object.
    # FIXME: this state does not make sense
    */
    this.reset_annotations();
    if(validate_annotator(annotator)) {
      doc.add_annotation(Annotation(annotator=annotator));
      return true;
    } else {
      return SPDXValueError('Annotation::Annotator');
    }
  }


  add_annotation_date(doc, annotation_date) {
    /*
    Sets the annotation date. Raises CardinalityError if
    already set. OrderError if no annotator defined before.
    Raises SPDXValueError if invalid value.
    */
    if(doc.annotations.length != 0) {
      if(!(this.annotation_date_set)) {
        this.annotation_date_set = true;
        let date = datetime_from_iso_format(annotation_date);
        if(date !== null) {
          doc.annotations[doc.annotations.length - 1].annotation_date = date;
          return true;
        } else {
          return SPDXValueError('Annotation::AnnotationDate');
        }
      } else {
        return CardinalityError('Annotation::AnnotationDate');
      }
    } else {
      return OrderError('Annotation::AnnotationDate');
    }
  }


    add_annotation_comment(doc, comment) {
      /*
      Sets the annotation comment. Raises CardinalityError if
      already set. OrderError if no annotator defined before.
      Raises SPDXValueError if comment is not free form text.
      */
      if(doc.annotations.length !== 0) {
        if(!(this.annotation_comment_set)) {
          this.annotation_comment_set = true
          if(validate_annotation_comment(comment)) {
            doc.annotations[doc.annotations.length - 1].comment = str_from_text(comment);
            return true;
          } else {
            return SPDXValueError('AnnotationComment::Comment');
          }
        }  else {
          return CardinalityError('AnnotationComment::Comment');
        }
      } else {
        return OrderError('AnnotationComment::Comment');
      }
    }


    add_annotation_type(doc, annotation_type) {
      /*
      Sets the annotation type. Raises CardinalityError if
      already set. OrderError if no annotator defined before.
      Raises SPDXValueError if invalid value.
      */
      if(doc.annotations.length != 0) {
        if(!(this.annotation_type_set)) {
          this.annotation_type_set = true;
          if(validations.validate_annotation_type(annotation_type)) {
            doc.annotations[doc.annotations.length - 1].annotation_type = annotation_type;
            return true;
          } else {
            return SPDXValueError('Annotation::AnnotationType');
          }
        } else {
          return CardinalityError('Annotation::AnnotationType');
        }
      } else {
      return OrderError('Annotation::AnnotationType');
    }
  }


    set_annotation_spdx_id(doc, spdx_id) {
      /*
      Sets the annotation SPDX Identifier.
      Raises CardinalityError if already set. OrderError if no annotator
      defined before.
      */
      if(doc.annotations.length != 0) {
        if (!(this.annotation_spdx_id_set)) {
          this.annotation_spdx_id_set = true;
          doc.annotations[doc.annotations.length - 1].spdx_id = spdx_id;
          return true;
        } else {
          return CardinalityError('Annotation::SPDXREF');
        }
      } else {
        return OrderError('Annotation::SPDXREF');
      }
    }
}

export class PackageBuilder {
  constructor() {
    this.VERIF_CODE_REGEX = /"([0-9a-f]+)\s*(\(\s*(.+)\))?"/;
    this.VERIF_CODE_CODE_GRP = 1;
    this.VERIF_CODE_EXC_FILES_GRP = 3;
    // # FIXME: this state does not make sense
    this.reset_package();
  }

  reset_package() {
    /*
    Resets the builder's state in order to build new packages.
    # FIXME: this state does not make sense
    */
    this.package_set = false
    this.package_vers_set = false
    this.package_file_name_set = false
    this.package_supplier_set = false
    this.package_originator_set = false
    this.package_down_location_set = false
    this.package_home_set = false
    this.package_verif_set = false
    this.package_chk_sum_set = false
    this.package_source_info_set = false
    this.package_conc_lics_set = false
    this.package_license_declared_set = false
    this.package_license_comment_set = false
    this.package_cr_text_set = false
    this.package_summary_set = false
    this.package_desc_set = false
  }


    create_package(doc, name) {
      /*
      Creates a package for the SPDX Document.
      name - any string.
      Raises CardinalityError if package already defined.
      */
      if(!(this.package_set)) {
        this.package_set = true;
        doc.package = Package(name=name);
        return true;
      } else {
        return CardinalityError('Package::Name');
      }

    }


    set_pkg_vers(doc, version) {
      /*
      Sets package version, if not already set.
      version - Any string.
      Raises CardinalityError if already has a version.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_vers_set)) {
        this.package_vers_set = true;
        doc.package.version = version;
        return true;
      } else {
        return CardinalityError('Package::Version');
      }

    }


    set_pkg_file_name(doc, name) {
      /*
      Sets the package file name, if not already set.
      name - Any string.
      Raises CardinalityError if already has a file_name.
      Raises OrderError if no pacakge previously defined.
      */
      this.assert_package_exists()
      if(!(this.package_file_name_set)) {
        this.package_file_name_set = true;
        doc.package.file_name = name;
        return true;
      } else {
        return CardinalityError('Package::FileName');
      }

    }


    set_pkg_supplier(doc, entity) {
      /*
      Sets the package supplier, if not already set.
      entity - Organization, Person or NoAssert.
      Raises CardinalityError if already has a supplier.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_supplier_set)) {
        this.package_supplier_set = true;
        if(validate_pkg_supplier(entity)) {
          doc.package.supplier = entity;
          return true;
        } else {
          return SPDXValueError('Package::Supplier');
        }
      } else {
        return CardinalityError('Package::Supplier');
      }

    }


    set_pkg_originator(doc, entity) {
      /*
      Sets the package originator, if not already set.
      entity - Organization, Person or NoAssert.
      Raises CardinalityError if already has an originator.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_originator_set)) {
        this.package_originator_set = true;
        if(validate_pkg_originator(entity)) {
          doc.package.originator = entity;
          return true;
        } else {
          return SPDXValueError('Package::Originator');
        }
      } else {
        return CardinalityError('Package::Originator');
      }

    }


    set_pkg_down_location(doc, location) {
      /*
      Sets the package download location, if not already set.
      location - A string
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_down_location_set)) {
        this.package_down_location_set = true;
        doc.package.download_location = location;
        return true;
      } else {
        return CardinalityError('Package::DownloadLocation')
      }
    }


    set_pkg_home(doc, location) {
      /*
      Sets the package homepage location if not already set.
      location - A string or None or NoAssert.
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      Raises SPDXValueError if location has incorrect value.
      */
      this.assert_package_exists()
      if(!(this.package_home_set)) {
        this.package_home_set = true;
        if(validate_pkg_homepage(location)) {
          doc.package.homepage = location;
          return true;
        } else {
          return SPDXValueError('Package::HomePage');
        }
      } else {
        return CardinalityError('Package::HomePage')
      }

    }


    set_pkg_verif_code(doc, code) {
      /*
      Sets the package verification code, if not already set.
      code - A string.
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      Raises Value error if doesn't match verifcode form
      */
      this.assert_package_exists()
      if(!(this.package_verif_set)) {
        this.package_verif_set = true;
        let match = this.VERIF_CODE_REGEX.exec(code);
        if(match) {
          doc.package.verif_code = match[this.VERIF_CODE_CODE_GRP];
          if (match[this.VERIF_CODE_EXC_FILES_GRP] !== null) {
            doc.package.verif_exc_files = match[this.VERIF_CODE_EXC_FILES_GRP].split(',')
          }
          return true;
        } else {
          return SPDXValueError('Package::VerificationCode');
        }
      } else {
        return CardinalityError('Package::VerificationCode');
      }

    }


    set_pkg_chk_sum(doc, chk_sum) {
      /*
      Sets the package check sum, if not already set.
      chk_sum - A string
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists()
      if(!(this.package_chk_sum_set)) {
        this.package_chk_sum_set = true;
        doc.package.check_sum = checksum_from_sha1(chk_sum);
        return true;
      } else {
        return CardinalityError('Package::CheckSum');
      }
    }


    set_pkg_source_info(doc, text) {
      /*
      Sets the package's source information, if not already set.
      text - Free form text.
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      SPDXValueError if text is not free form text.
      */
      this.assert_package_exists();
      if(!(this.package_source_info_set)) {
        this.package_source_info_set = true;
        if(validate_pkg_src_info(text)) {
          doc.package.source_info = str_from_text(text);
          return true;
        } else {
          return SPDXValueError('Pacckage::SourceInfo');
        }
      } else {
        return CardinalityError('Package::SourceInfo');
      }
    }

    set_pkg_licenses_concluded(doc, licenses) {
      /*
      Sets the package's concluded licenses.
      licenses - License info.
      Raises CardinalityError if already defined.
      Raises OrderError if no package previously defined.
      Raises SPDXValueError if data malformed.
      */
      this.assert_package_exists()
      if(!(this.package_conc_lics_set)) {
        this.package_conc_lics_set = true
        if(validate_lics_conc(licenses)) {
          doc.package.conc_lics = licenses;
          return true;
        } else {
          return SPDXValueError('Package::ConcludedLicenses');
        }
      } else {
        return CardinalityError('Package::ConcludedLicenses');
      }
    }


    set_pkg_license_from_file(doc, lic) {
      /*
      Adds a license from a file to the package.
      Raises SPDXValueError if data malformed.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(validate_lics_from_file(lic)) {
        doc.package.licenses_from_files.append(lic);
        return true;
      } else {
        return SPDXValueError('Package::LicensesFromFile');
      }
    }


    set_pkg_license_declared(doc, lic) {
      /*
      Sets the package's declared license.
      Raises SPDXValueError if data malformed.
      Raises OrderError if no package previously defined.
      Raises CardinalityError if already set.
      */
      this.assert_package_exists()
      if(!(this.package_license_declared_set)) {
        this.package_license_declared_set = true;
        if(validate_lics_conc(lic)) {
          doc.package.license_declared = lic;
          return true;
        } else {
            return SPDXValueError('Package::LicenseDeclared');
          }
      } else {
          return CardinalityError('Package::LicenseDeclared');
        }
    }


    set_pkg_license_comment(doc, text) {
      /*
      Sets the package's license comment.
      Raises OrderError if no package previously defined.
      Raises CardinalityError if already set.
      Raises SPDXValueError if text is not free form text.
      */
      this.assert_package_exists();
      if(!(this.package_license_comment_set)) {
        this.package_license_comment_set = true
        if(validate_pkg_lics_comment(text)) {
          doc.package.license_comment = str_from_text(text);
          return true;
        } else {
          return SPDXValueError('Package::LicenseComment');
        }
      } else {
        return CardinalityError('Package::LicenseComment');
      }

    }


    set_pkg_cr_text(doc, text) {
      /*
      Sets the package's copyright text.
      Raises OrderError if no package previously defined.
      Raises CardinalityError if already set.
      Raises value error if text is not one of [None, NOASSERT, TEXT].
      */
      this.assert_package_exists();
      if(!(this.package_cr_text_set)) {
        this.package_cr_text_set = true;
        if(validate_pkg_cr_text(text)) {
          if (text instanceof string_types) {
            doc.package.cr_text = str_from_text(text);
          } else {
            doc.package.cr_text = text;
          }
        }
        else {
          return SPDXValueError('Package::CopyrightText');
        }
      } else {
        return CardinalityError('Package::CopyrightText');
      }
    }


    set_pkg_summary(doc, text) {
      /*
      Set's the package summary.
      Raises SPDXValueError if text is not free form text.
      Raises CardinalityError if summary already set.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_summary_set)) {
        this.package_summary_set = true;
        if(validate_pkg_summary(text)) {
          doc.package.summary = str_from_text(text);
        } else {
          return SPDXValueError('Package::Summary');
        }
      } else {
        return CardinalityError('Package::Summary');
      }

    }

    set_pkg_desc(doc, text) {
      /*
      Set's the package's description.
      Raises SPDXValueError if text is not free form text.
      Raises CardinalityError if description already set.
      Raises OrderError if no package previously defined.
      */
      this.assert_package_exists();
      if(!(this.package_desc_set)) {
        this.package_desc_set = true;
        if(validate_pkg_desc(text)) {
          doc.package.description = str_from_text(text);
        } else {
            return SPDXValueError('Package::Description');
          }
      } else {
        return CardinalityError('Package::Description');
      }
    }

    assert_package_exists() {
      if(!(this.package_set)) {
        return OrderError('Package')
      }

    }
}

export class FileBuilder {
  constructor() {
    //# FIXME: this state does not make sense
    this.reset_file_stat();
  }

  set_file_name(doc, name) {
    /*Raises OrderError if no package defined.
    */
    if(this.has_package(doc)) {
      doc.package.files.append(file.File(name))
      // # A file name marks the start of a new file instance.
      // # The builder must be reset
      // # FIXME: this state does not make sense
      this.reset_file_stat();
      return true;
    } else {
      return OrderError('File::Name');
    }
  }


    set_file_spdx_id(doc, spdx_id) {
      /*
      Sets the file SPDX Identifier.
      Raises OrderError if no package or no file defined.
      Raises SPDXValueError if malformed value.
      Raises CardinalityError if more than one spdx_id set.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_spdx_id_set)) {
          this.file_spdx_id_set = true;
          if(validate_file_spdx_id(spdx_id)) {
            this.file(doc).spdx_id = spdx_id
            return true;
          } else {
            return SPDXValueError('File::SPDXID')
          }
        } else {
          return CardinalityError('File::SPDXID')
        }
      } else {
        return OrderError('File::SPDXID')
      }
    }


    set_file_comment(doc, text) {
      /*
      Raises OrderError if no package or no file defined.
      Raises CardinalityError if more than one comment set.
      Raises SPDXValueError if text is not free form text.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_comment_set)) {
          this.file_comment_set = true
          if(validate_file_comment(text)) {
            this.file(doc).comment = str_from_text(text);
            return true;
          } else {
            return SPDXValueError('File::Comment')
          }
        } else {
          return CardinalityError('File::Comment')
        }
      } else {
        return OrderError('File::Comment')
      }
    }


    set_file_type(doc, type_value) {
      /*
      Raises OrderError if no package or file defined.
      Raises CardinalityError if more than one type set.
      Raises SPDXValueError if type is unknown.
      */
      type_dict = {
          'SOURCE': SpdxFileType.SOURCE,
          'BINARY': SpdxFileType.BINARY,
          'ARCHIVE': SpdxFileType.ARCHIVE,
          'OTHER': SpdxFileType.OTHER
      }
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_type_set)) {
          this.file_type_set = true;
          if(type_dict.keys().includes(type_value)) {
            this.file(doc).type = type_dict[type_value];
            return true;
          } else {
            return SPDXValueError('File::Type')
          }
        } else {
          return CardinalityError('File::Type')
        }
      } else {
        return OrderError('File::Type')
      }
    }


    set_file_chksum(doc, chksum) {
      /*
      Raises OrderError if no package or file defined.
      Raises CardinalityError if more than one chksum set.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_chksum_set)) {
          this.file_chksum_set = true;
          this.file(doc).chk_sum = checksum_from_sha1(chksum);
          return true;
        } else {
          return CardinalityError('File::CheckSum');
        }
      } else {
        return OrderError('File::CheckSum');
      }

    }


    set_concluded_license(doc, lic) {
      /*
      Raises OrderError if no package or file defined.
      Raises CardinalityError if already set.
      Raises SPDXValueError if malformed.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_conc_lics_set)) {
          this.file_conc_lics_set = true
          if(validate_lics_conc(lic)) {
            this.file(doc).conc_lics = lic
            return true;
          }
          else {
            return SPDXValueError('File::ConcludedLicense')
          }
        } else {
          return CardinalityError('File::ConcludedLicense')
        }
      } else {
        return OrderError('File::ConcludedLicense')
      }

    }


    set_file_license_in_file(doc, lic) {
      /*
      Raises OrderError if no package or file defined.
      Raises SPDXValueError if malformed value.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(validate_file_lics_in_file(lic)) {
          this.file(doc).add_lics(lic)
          return true;
        } else {
          return SPDXValueError('File::LicenseInFile')
        }
      } else {
        return OrderError('File::LicenseInFile')
      }
    }


    set_file_license_comment(doc, text) {
      /*
      Raises OrderError if no package or file defined.
      Raises SPDXValueError if text is not free form text.
      Raises CardinalityError if more than one per file.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_license_comment_set)) {
          this.file_license_comment_set = true;
          if(validate_file_lics_comment(text)) {
            this.file(doc).license_comment = str_from_text(text)
          } else {
            return SPDXValueError('File::LicenseComment');
          }
        } else {
          return CardinalityError('File::LicenseComment');
        }
      } else {
        return OrderError('File::LicenseComment')
      }
    }


    set_file_copyright(doc, text) {
      /*Raises OrderError if no package or file defined.
      Raises SPDXValueError if not free form text or NONE or NO_ASSERT.
      Raises CardinalityError if more than one.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_copytext_set)) {
          this.file_copytext_set = true;
          if(validate_file_copyright(text)) {
            if(text instanceof string_types) {
              this.file(doc).copyright = str_from_text(text)
            } else {
              this.file(doc).copyright = text;  // None or NoAssert
            }
            return true;
          }
          else {
            return SPDXValueError('File::CopyRight');
          }
        } else {
          return CardinalityError('File::CopyRight');
        }
      } else {
        return OrderError('File::CopyRight');
      }
    }


    set_file_notice(doc, text) {
      /*Raises OrderError if no package or file defined.
      Raises SPDXValueError if not free form text.
      Raises CardinalityError if more than one.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        if(!(this.file_notice_set)) {
          this.file_notice_set = true
          if(validate_file_notice(text)) {
            this.file(doc).notice = str_from_text(text)
          } else {
            return SPDXValueError('File::Notice');
          }
        } else {
          return CardinalityError('File::Notice');
        }
      } else {
        return OrderError('File::Notice');
      }
    }


    add_file_contribution(doc, value) {
      /*Raises OrderError if no package or file defined.
      */
      if (this.has_package(doc) && this.has_file(doc)) {
        this.file(doc).add_contrib(value);
      } else {
        return OrderError('File::Contributor')
      }
    }


    add_file_dep(doc, value) {
      /*Raises OrderError if no package or file defined.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        this.file(doc).add_depend(value);
      } else {
        return OrderError('File::Dependency')
      }

    }


    set_file_atrificat_of_project(doc, symbol, value) {
      /*Sets a file name, uri or home artificat.
      Raises OrderError if no package or file defined.
      */
      if(this.has_package(doc) && this.has_file(doc)) {
        this.file(doc).add_artifact(symbol, value);
      } else {
        return OrderError('File::Artificat');
      }
    }



    file(doc) {
      /*Returns the last file in the document's package's file list.*/
      return doc.package.files[doc.package.files.length - 1];
    }


    has_file(doc) {
      /*Returns true if the document's package has at least one file.
    Does not test if the document has a package.
    */
    return doc.package.files.length != 0
  }


    has_package(doc) {
      /*Returns true if the document has a package.*/
      return doc.package !== null
    }


    reset_file_stat(self) {
      /*Resets the builder's state to enable building new files.*/
      // # FIXME: this state does not make sense
      this.file_spdx_id_set = false
      this.file_comment_set = false
      this.file_type_set = false
      this.file_chksum_set = false
      this.file_conc_lics_set = false
      this.file_license_comment_set = false
      this.file_notice_set = false
      this.file_copytext_set = false
    }
}

export class LicenseBuilder {

    constructor() {
      // # FIXME: this state does not make sense
      this.reset_extr_lics()
    }


    extr_lic(doc) {
      /*Retrieves last license in extracted license list*/
      return doc.extracted_licenses[doc.extracted_licenses.length - 1]
    }


    has_extr_lic(doc) {
      return len(doc.extracted_licenses) !== 0
    }


    set_lic_id(doc, lic_id) {
      /*Adds a new extracted license to the document.
      Raises SPDXValueError if data format is incorrect.
      */
      // # FIXME: this state does not make sense
      this.reset_extr_lics();
      if(validate_extracted_lic_id(lic_id)) {
        doc.add_extr_lic(document.ExtractedLicense(lic_id))
        return true;
      } else {
        return SPDXValueError('ExtractedLicense::id')
      }
    }


    set_lic_text(doc, text) {
      /*Sets license extracted text.
      Raises SPDXValueError if text is not free form text.
      Raises OrderError if no license ID defined.
      */
      if(this.has_extr_lic(doc)) {
        if(!(this.extr_text_set)) {
          this.extr_text_set = true
          if(validate_is_free_form_text(text)) {
            this.extr_lic(doc).text = str_from_text(text);
            return true;
          } else {
            return SPDXValueError('ExtractedLicense::text')
          }
        } else {
          return CardinalityError('ExtractedLicense::text')
        }
      } else {
        return OrderError('ExtractedLicense::text')
      }

    }


    set_lic_name(doc, name) {
      /*Sets license name.
      Raises SPDXValueError if name is not str or utils.NoAssert
      Raises OrderError if no license id defined.
      */
      if(this.has_extr_lic(doc)) {
        if(!(this.extr_lic_name_set)) {
          this.extr_lic_name_set = true;
          if(validate_extr_lic_name(name)) {
            this.extr_lic(doc).full_name = name
            return true
          } else {
            return SPDXValueError('ExtractedLicense::Name')
          }
        } else {
          return CardinalityError('ExtractedLicense::Name')
        }
      } else {
        return OrderError('ExtractedLicense::Name')
      }

    }


    set_lic_comment(doc, comment) {
      /*Sets license comment.
      Raises SPDXValueError if comment is not free form text.
      Raises OrderError if no license ID defined.
      */
      if(this.has_extr_lic(doc)) {
        if(!(this.extr_lic_comment_set)) {
          this.extr_lic_comment_set = true
          if(validate_is_free_form_text(comment)) {
            this.extr_lic(doc).comment = str_from_text(comment)
            return true
          } else {
            return SPDXValueError('ExtractedLicense::comment')
          }
        } else {
          return CardinalityError('ExtractedLicense::comment')
        }
      } else {
        return OrderError('ExtractedLicense::comment')
      }
    }



    add_lic_xref(doc, ref) {
      /*Adds a license cross reference.
      Raises OrderError if no License ID defined.
      */
      if(this.has_extr_lic(doc)) {
        this.extr_lic(doc).add_xref(ref)
        return true
      } else {
        return OrderError('ExtractedLicense::CrossRef')
      }
    }



    reset_extr_lics(self) {
      // # FIXME: this state does not make sense
      this.extr_text_set = false
      this.extr_lic_name_set = false
      this.extr_lic_comment_set = false
    }

  }


export class SnippetBuilder {
  constructor() {
    // # FIXME: this state does not make sense
    this.reset_snippet();
  }


  create_snippet(doc, spdx_id) {
    /*Creates a snippet for the SPDX Document.
    spdx_id - To uniquely identify any element in an SPDX document which
    may be referenced by other elements.
    Raises SPDXValueError if the data is a malformed value.
    */
    this.reset_snippet();
    spdx_id = spdx_id.split('#')[spdx_id.split('#').length - 1]
    if(validate_snippet_spdx_id(spdx_id)) {
      doc.add_snippet(snippet.Snippet(spdx_id=spdx_id))
      this.snippet_spdx_id_set = true;
      return true;
    } else {
      return SPDXValueError('Snippet::SnippetSPDXID')
    }
  }


  set_snippet_name(doc, name) {
    /*
    Sets name of the snippet.
    Raises OrderError if no snippet previously defined.
    Raises CardinalityError if the name is already set.
    */
    this.assert_snippet_exists();
    if(!(this.snippet_name_set)) {
      this.snippet_name_set = true;
      doc.snippet[-1].name = name;
      return true;
    } else {
      return CardinalityError('SnippetName')
    }

  }


  set_snippet_comment(doc, comment) {
    /*
    Sets general comments about the snippet.
    Raises OrderError if no snippet previously defined.
    Raises SPDXValueError if the data is a malformed value.
    Raises CardinalityError if comment already set.
    */
    this.assert_snippet_exists();
    if(!(this.snippet_comment_set)) {
      this.snippet_comment_set = true
      if(validate_snip_comment(comment)) {
        doc.snippet[-1].comment = str_from_text(comment)
        return true;
      } else {
        return SPDXValueError('Snippet::SnippetComment')
      }
    } else {
      return CardinalityError('Snippet::SnippetComment')
    }

  }


  set_snippet_copyright(doc, text) {
    /*Sets the snippet's copyright text.
    Raises OrderError if no snippet previously defined.
    Raises CardinalityError if already set.
    Raises SPDXValueError if text is not one of [None, NOASSERT, TEXT].
    */
    this.assert_snippet_exists();
    if(!(this.snippet_copyright_set)) {
      this.snippet_copyright_set = true
      if(validate_snippet_copyright(text)) {
        if(text instanceof string_types) {
          doc.snippet[-1].copyright = str_from_text(text);
        } else {
          doc.snippet[-1].copyright = text;  // None or NoAssert
        }
      } else {
        return SPDXValueError('Snippet::SnippetCopyrightText')
      }
    } else {
      return CardinalityError('Snippet::SnippetCopyrightText')
    }

  }


  set_snippet_lic_comment(doc, text) {
    /*Sets the snippet's license comment.
    Raises OrderError if no snippet previously defined.
    Raises CardinalityError if already set.
    Raises SPDXValueError if the data is a malformed value.
    */
    this.assert_snippet_exists()
    if(!(this.snippet_lic_comment_set)) {
      this.snippet_lic_comment_set = true;
      if(validate_snip_lic_comment(text)) {
        doc.snippet[-1].license_comment = str_from_text(text)
        return true
      } else {
        return SPDXValueError('Snippet::SnippetLicenseComments')
      }
    } else {
      return CardinalityError('Snippet::SnippetLicenseComments')
    }
  }



  set_snip_from_file_spdxid(doc, snip_from_file_spdxid) {
    /*Sets the snippet's 'Snippet from File SPDX Identifier'.
    Raises OrderError if no snippet previously defined.
    Raises CardinalityError if already set.
    Raises SPDXValueError if the data is a malformed value.
    */
    this.assert_snippet_exists();
    snip_from_file_spdxid = snip_from_file_spdxid.split('#')[-1]
    if(!(this.snip_file_spdxid_set)) {
      this.snip_file_spdxid_set = true
      if(validate_snip_file_spdxid(snip_from_file_spdxid)) {
        doc.snippet[-1].snip_from_file_spdxid = snip_from_file_spdxid
        return true
      } else {
        return SPDXValueError('Snippet::SnippetFromFileSPDXID')
      }
    } else {
      return CardinalityError('Snippet::SnippetFromFileSPDXID')
    }

  }


  set_snip_concluded_license(doc, conc_lics) {
      /*
      Raises OrderError if no snippet previously defined.
      Raises CardinalityError if already set.
      Raises SPDXValueError if the data is a malformed value.
      */
      this.assert_snippet_exists();
      if(!(this.snippet_conc_lics_set)) {
        this.snippet_conc_lics_set = true;
        if(validate_lics_conc(conc_lics)) {
          doc.snippet[-1].conc_lics = conc_lics
          return true
        } else {
          return SPDXValueError('Snippet::SnippetLicenseConcluded')
        }
      } else {
        return CardinalityError('Snippet::SnippetLicenseConcluded')
      }
  }


  set_snippet_lics_info(doc, lics_info) {
    /*
    Raises OrderError if no snippet previously defined.
    Raises SPDXValueError if the data is a malformed value.
    */
    this.assert_snippet_exists();
    if(validate_snip_lics_info(lics_info)) {
      doc.snippet[-1].add_lics(lics_info)
      return true
    } else {
      return SPDXValueError('Snippet::LicenseInfoInSnippet')
    }

  }


  reset_snippet() {
    // # FIXME: this state does not make sense
    this.snippet_spdx_id_set = false
    this.snippet_name_set = false
    this.snippet_comment_set = false
    this.snippet_copyright_set = false
    this.snippet_lic_comment_set = false
    this.snip_file_spdxid_set = false
    this.snippet_conc_lics_set = false
  }

  assert_snippet_exists(self) {
    if(!(this.snippet_spdx_id_set)) {
      return OrderError('Snippet')
    }
  }
}


const multiple_inheritance = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }
    let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
              .concat(Object.getOwnPropertySymbols(source))
              .forEach((prop) => {
                 if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
               })
    }
    mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
}


export class Builder extends multiple_inheritance(DocBuilder, CreationInfoBuilder, EntityBuilder, ReviewBuilder,
              PackageBuilder, FileBuilder, LicenseBuilder, SnippetBuilder,
              ExternalDocumentRefBuilder, AnnotationBuilder) {

    /*SPDX document builder.*/

    constructor() {
      super()
      // # FIXME: this state does not make sense
      this.reset();
    }


    reset() {
      /*Resets builder's state for building new documents.
      Must be called between usage with different documents.
      */
      // # FIXME: this state does not make sense
      this.reset_creation_info()
      this.reset_document()
      this.reset_package()
      this.reset_file_stat()
      this.reset_reviews()
      this.reset_annotations()
      this.reset_extr_lics()
      this.reset_snippet()
    }

  }
