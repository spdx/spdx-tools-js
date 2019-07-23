// SPDX-License-Identifier: MIT

import Creator from '../creationInfo';
import Person from '../creationInfo';
import Organization from '../creationInfo';
import Document from '../document';
import License from '../document';
import SPDXNone from '../utils';
import NoAssert from '../utils';

export const validate_is_free_form_text = (value, optional = false) => {
  let regex = /'<text>(.|\n)*<\/text>'/;
  if(value === null) {
    return optional;
  } else {
    regex.exec(value) !== null;
  }
}

export const validate_tool_name = (value, optional = false) => {
  let stripped_value = value.replace(/\s/g, '');
  if(optional) {
    if(stripped_value.length === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return !(stripped_value.length === 0);
  }
}

export const validate_person_name = (value, optional = false) => {
  return validate_tool_name(value, optional);
}

export const validate_org_name = (value, optional = false) => {
  return validate_tool_name(value, optional);
}

export const validate_data_lics = (value) => {
  return value === 'CC0-1.0';
}

export const validate_doc_name = (value, optional = false) => {
  return validate_tool_name(value, optional);
}

export const validate_pkg_supplier = (value, optional = false) => {
  if(optional && value === null) {
    return true;
  } else if(value instanceof SPDXNone || value instanceof Person || value instanceof Organization) {
    return true;
  } else {
    return false;
  }
}

export const validate_pkg_originator = (value, optional = false) => {
  return validate_pkg_supplier(value, optional);
}

export const validate_pkg_homepage = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value instanceof NoAssert || value instanceof SPDXNone) {
    //@TODO: Fix this
    return true;
  } else {
    return false;
  }
}

export const validate_pkg_cr_text = (value, optional = false) => {
  if(value instanceof NoAssert || value instanceof SPDXNone) {
    return true;
  } else if(validate_is_free_form_text(value, optional)) {
    return true;
  } else if(value === null) {
    return optional;
  } else {
    return false;
  }
}

export const validate_pkg_summary = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}


export const validate_pkg_desc = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}


export const validate_doc_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_doc_spdx_id = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value.endswith('#SPDXRef-DOCUMENT')) {
    return true;
  } else {
    return false;
  }
}

export const validate_doc_namespace = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if((value.startswith('http://') || value.startswith('https://') || value.startswith('ftp://')) && (!(value.includes("#")))) {
    return true;
  } else {
    return false;
  }
}

export const validate_creator = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else {
    return value instanceof Creator;
  }
}

export const validate_creation_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_reviewer = (value, optional = false) => {
  return validate_creator(value, optional);
}

export const validate_review_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_annotator = (value, optional = false) => {
  return validate_creator(value, optional);
}

export const validate_annotation_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_annotaion_type = (value, optional = false) => {
  let n_value = value.replace(/^\s+|\s+$/g, '');
  if(n_value === "REVIEW" || n_value === "OTHER") {
    return true;
  } else {
    return false;
  }
}

export const validate_pkg_src_info = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_pkg_lics_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_file_spdx_id = (value, optional = false) => {
  let split_value = value.split('#')
  let n_value = split_value[split_value.length - 1]
  let regex = /'SPDXRef-([A-Za-z0-9.\-]+)'/;
  if(n_value === null) {
    return optional;
  } else {
    regex.exec(n_value) !== null;
  }
}

export const validate_file_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_file_lics_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_file_copyright = (value, optional = false) => {
  if(value instanceof NoAssert || value instanceof SPDXNone) {
    return true;
  } else if(validate_is_free_form_text(value, optional)) {
    return true;
  } else {
    return false;
  }
}

export const validate_lics_from_file = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value instanceof NoAssert || value instanceof SPDXNone || value instanceof License) {
    return true;
  } else {
    return false;
  }
}

export const validate_file_notice = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_lics_conc = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value instanceof NoAssert || value instanceof SPDXNone || value instanceof License) {
    return true;
  } else {
    return false;
  }
}

export const validate_file_lics_in_file = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value instanceof NoAssert || value instanceof SPDXNone || value instanceof License) {
    return true;
  } else {
    return false;
  }
}

export const validate_extracted_lic_id = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else {
    return value.startsWith("LicenseRef");
  }
}

export const validate_extr_lic_name = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else {
    // @TODO: Update this
    return value instanceof NoAssert;
  }
}

export const validate_snippet_spdx_id = (value, optional = false) => {
  let regex = /'^SPDXRef[A-Za-z0-9.\-]+$'/;
  if(regex.exec(value) !== null) {
    return true;
  } else {
    return false;
  }
}

export const validate_snip_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_snippet_copyright = (value, optional = false) => {
  if(validate_is_free_form_text(value, optional)) {
    return true;
  } else if(value instanceof NoAssert || value instanceof SPDXNone) {
    return true;
  } else if(value === null) {
    return optional;
  } else {
    return false;
  }
}

export const validate_snip_lic_comment = (value, optional = false) => {
  return validate_is_free_form_text(value, optional);
}

export const validate_snip_file_spdxid = (value, optional = false) => {
  let regex = /'(DocumentRef[A-Za-z0-9.\-]+:){0,1}SPDXRef[A-Za-z0-9.\-]+'/;
  if(regex.exec(value) !== null) {
    return true;
  } else {
    return false;
  }
}

export const validate_snip_lics_info = (value, optional = false) => {
  if(value === null) {
    return optional;
  } else if(value instanceof NoAssert || value instanceof SPDXNone || value instanceof License) {
    return true;
  } else {
    return false;
  }
}
