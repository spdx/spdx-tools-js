// SPDX-License-Identifier: MIT

import datetime_from_iso_format from '../utils';
import Document from '../document';
import SPDXValueError from './builderexceptions';
import CardinalityError from './builderexceptions';
import OrderError from './builderexceptions';
import Lexer from './lexers/tagvalue';
import SPDXNone from '../utils';
import NoAssert from '../utils';
import LicenseListParser from '../utils';


export const ERROR_MESSAGES = {
    'TOOL_VALUE': 'Invalid tool value {0} at line: {1}',
    'ORG_VALUE': 'Invalid organization value {0} at line: {1}',
    'PERSON_VALUE': 'Invalid person value {0} at line: {1}',
    'CREATED_VALUE_TYPE': 'Created value must be date in ISO 8601 format, line: {0}',
    'MORE_THAN_ONE': 'Only one {0} allowed, extra at line: {1}',
    'CREATOR_COMMENT_VALUE_TYPE': 'CreatorComment value must be free form text between <text></text> tags, line:{0}',
    'DOC_LICENSE_VALUE': 'Invalid DataLicense value \'{0}\', line:{1} must be CC0-1.0',
    'DOC_LICENSE_VALUE_TYPE': 'DataLicense must be CC0-1.0, line: {0}',
    'DOC_VERSION_VALUE': 'Invalid SPDXVersion \'{0}\' must be SPDX-M.N where M and N are numbers. Line: {1}',
    'DOC_VERSION_VALUE_TYPE': 'Invalid SPDXVersion value, must be SPDX-M.N where M and N are numbers. Line: {0}',
    'DOC_NAME_VALUE': 'DocumentName must be single line of text, line: {0}',
    'DOC_SPDX_ID_VALUE': 'Invalid SPDXID value, SPDXID must be SPDXRef-DOCUMENT, line: {0}',
    'EXT_DOC_REF_VALUE': 'ExternalDocumentRef must contain External Document ID, SPDX Document URI and Checksum in the standard format, line:{0}.',
    'DOC_COMMENT_VALUE_TYPE': 'DocumentComment value must be free form text between <text></text> tags, line:{0}',
    'DOC_NAMESPACE_VALUE': 'Invalid DocumentNamespace value {0}, must contain a scheme (e.g. "https:") and should not contain the "#" delimiter, line:{1}',
    'DOC_NAMESPACE_VALUE_TYPE': 'Invalid DocumentNamespace value, must contain a scheme (e.g. "https:") and should not contain the "#" delimiter, line: {0}',
    'REVIEWER_VALUE_TYPE': 'Invalid Reviewer value must be a Person, Organization or Tool. Line: {0}',
    'CREATOR_VALUE_TYPE': 'Invalid Reviewer value must be a Person, Organization or Tool. Line: {0}',
    'REVIEW_DATE_VALUE_TYPE': 'ReviewDate value must be date in ISO 8601 format, line: {0}',
    'REVIEW_COMMENT_VALUE_TYPE': 'ReviewComment value must be free form text between <text></text> tags, line:{0}',
    'ANNOTATOR_VALUE_TYPE': 'Invalid Annotator value must be a Person, Organization or Tool. Line: {0}',
    'ANNOTATION_DATE_VALUE_TYPE': 'AnnotationDate value must be date in ISO 8601 format, line: {0}',
    'ANNOTATION_COMMENT_VALUE_TYPE': 'AnnotationComment value must be free form text between <text></text> tags, line:{0}',
    'ANNOTATION_TYPE_VALUE': 'AnnotationType must be "REVIEW" or "OTHER". Line: {0}',
    'ANNOTATION_SPDX_ID_VALUE': 'SPDXREF must be ["DocumentRef-"[idstring]":"]SPDXID where ["DocumentRef-"[idstring]":"] is an optional reference to an external SPDX document and SPDXID is a unique string containing letters, numbers, ".","-".',
    'A_BEFORE_B': '{0} Can not appear before {1}, line: {2}',
    'PACKAGE_NAME_VALUE': 'PackageName must be single line of text, line: {0}',
    'PKG_VERSION_VALUE': 'PackageVersion must be single line of text, line: {0}',
    'PKG_FILE_NAME_VALUE': 'PackageFileName must be single line of text, line: {0}',
    'PKG_SUPPL_VALUE': 'PackageSupplier must be Organization, Person or NOASSERTION, line: {0}',
    'PKG_ORIG_VALUE': 'PackageOriginator must be Organization, Person or NOASSERTION, line: {0}',
    'PKG_DOWN_VALUE': 'PackageDownloadLocation must be a url or NONE or NOASSERTION, line: {0}',
    'PKG_HOME_VALUE': 'PackageHomePage must be a url or NONE or NOASSERTION, line: {0}',
    'PKG_SRC_INFO_VALUE': 'PackageSourceInfo must be free form text, line: {0}',
    'PKG_CHKSUM_VALUE': 'PackageChecksum must be a single line of text, line: {0}',
    'PKG_LICS_CONC_VALUE': 'PackageLicenseConcluded must be NOASSERTION, NONE, license identifier or license list, line: {0}',
    'PKG_LIC_FFILE_VALUE': 'PackageLicenseInfoFromFiles must be, line: {0}',
    'PKG_LICS_DECL_VALUE': 'PackageLicenseDeclared must be NOASSERTION, NONE, license identifier or license list, line: {0}',
    'PKG_LICS_COMMENT_VALUE': 'PackageLicenseComments must be free form text, line: {0}',
    'PKG_SUM_VALUE': 'PackageSummary must be free form text, line: {0}',
    'PKG_DESC_VALUE': 'PackageDescription must be free form text, line: {0}',
    'FILE_NAME_VALUE': 'FileName must be a single line of text, line: {0}',
    'FILE_COMMENT_VALUE': 'FileComment must be free form text, line:{0}',
    'FILE_TYPE_VALUE': 'FileType must be one of OTHER, BINARY, SOURCE or ARCHIVE, line: {0}',
    'FILE_SPDX_ID_VALUE': 'SPDXID must be "SPDXRef-[idstring]" where [idstring] is a unique string containing letters, numbers, ".", "-".',
    'FILE_CHKSUM_VALUE': 'FileChecksum must be a single line of text starting with \'SHA1:\', line:{0}',
    'FILE_LICS_CONC_VALUE': 'LicenseConcluded must be NOASSERTION, NONE, license identifier or license list, line:{0}',
    'FILE_LICS_INFO_VALUE': 'LicenseInfoInFile must be NOASSERTION, NONE or license identifier, line: {0}',
    'FILE_LICS_COMMENT_VALUE': 'LicenseComments must be free form lext, line: {0}',
    'FILE_CR_TEXT_VALUE': 'FileCopyrightText must be one of NOASSERTION, NONE or free form text, line: {0}',
    'FILE_NOTICE_VALUE': 'FileNotice must be free form text, line: {0}',
    'FILE_CONTRIB_VALUE': 'FileContributor must be a single line, line: {0}',
    'FILE_DEP_VALUE': 'FileDependency must be a single line, line: {0}',
    'ART_PRJ_NAME_VALUE' : 'ArtifactOfProjectName must be a single line, line: {0}',
    'FILE_ART_OPT_ORDER' : 'ArtificatOfProjectHomePage and ArtificatOfProjectURI must immediatly follow ArtifactOfProjectName, line: {0}',
    'ART_PRJ_HOME_VALUE' : 'ArtificatOfProjectHomePage must be a URL or UNKNOWN, line: {0}',
    'ART_PRJ_URI_VALUE' : 'ArtificatOfProjectURI must be a URI or UNKNOWN, line: {0}',
    'UNKNOWN_TAG' : 'Found unknown tag : {0} at line: {1}',
    'LICS_ID_VALUE' : 'LicenseID must start with \'LicenseRef-\', line: {0}',
    'LICS_TEXT_VALUE' : 'ExtractedText must be free form text, line: {0}',
    'LICS_NAME_VALE' : 'LicenseName must be single line of text or NOASSERTION, line: {0}',
    'LICS_COMMENT_VALUE' : 'LicenseComment must be free form text, line: {0}',
    'LICS_CRS_REF_VALUE' : 'LicenseCrossReference must be uri as single line of text, line: {0}',
    'PKG_CPY_TEXT_VALUE' : 'Package copyright text must be free form text, line: {0}',
    'SNIP_SPDX_ID_VALUE' : 'SPDXID must be "SPDXRef-[idstring]" where [idstring] is a unique string containing letters, numbers, ".", "-".',
    'SNIPPET_NAME_VALUE' : 'SnippetName must be a single line of text, line: {0}',
    'SNIP_COMMENT_VALUE' : 'SnippetComment must be free form text, line: {0}',
    'SNIP_COPYRIGHT_VALUE' : 'SnippetCopyrightText must be one of NOASSERTION, NONE or free form text, line: {0}',
    'SNIP_LICS_COMMENT_VALUE' : 'SnippetLicenseComments must be free form text, line: {0}',
    'SNIP_FILE_SPDXID_VALUE' : 'SnippetFromFileSPDXID must be ["DocumentRef-"[idstring]":"] SPDXID where DocumentRef-[idstring]: is an optional reference to an external SPDX Document and SPDXID is a string containing letters, numbers, ".", "-".',
    'SNIP_LICS_CONC_VALUE': 'SnippetLicenseConcluded must be NOASSERTION, NONE, license identifier or license list, line:{0}',
    'SNIP_LICS_INFO_VALUE': 'LicenseInfoInSnippet must be NOASSERTION, NONE or license identifier, line: {0}',
}

export class Parser {

  constructor(builder, logger) {
    this.tokens = Lexer.tokens
    this.builder = builder
    this.logger = logger
    this.error = false
    this.license_list_parser = LicenseListParser()
    this.license_list_parser.build(write_tables=0, debug=0)
  }

  p_start_1(p) {
    'start : start attrib '
    return
  }


    p_start_2(p) {
      'start : attrib '
      return
    }


    p_attrib(p) {
      /*
      attrib : spdx_version
                | spdx_id
                | data_lics
                | doc_name
                | ext_doc_ref
                | doc_comment
                | doc_namespace
                | creator
                | created
                | creator_comment
                | locs_list_ver
                | reviewer
                | review_date
                | review_comment
                | annotator
                | annotation_date
                | annotation_comment
                | annotation_type
                | annotation_spdx_id
                | package_name
                | package_version
                | pkg_down_location
                | pkg_home
                | pkg_summary
                | pkg_src_info
                | pkg_file_name
                | pkg_supplier
                | pkg_orig
                | pkg_chksum
                | pkg_verif
                | pkg_desc
                | pkg_lic_decl
                | pkg_lic_conc
                | pkg_lic_ff
                | pkg_lic_comment
                | pkg_cr_text
                | file_name
                | file_type
                | file_chksum
                | file_conc
                | file_lics_info
                | file_cr_text
                | file_lics_comment
                | file_notice
                | file_comment
                | file_contrib
                | file_dep
                | file_artifact
                | snip_spdx_id
                | snip_name
                | snip_comment
                | snip_cr_text
                | snip_lic_comment
                | snip_file_spdx_id
                | snip_lics_conc
                | snip_lics_info
                | extr_lic_id
                | extr_lic_text
                | extr_lic_name
                | lic_xref
                | lic_comment
                | unknown_tag
      */
      return
    }


    more_than_one_error(tag, line) {
      this.error = true
      const msg = ERROR_MESSAGES['MORE_THAN_ONE'].replace('{0}', tag).replace('{1}', line)
      this.logger.log(msg)
    }


    order_error(first_tag, second_tag, line) {
      /*Reports an OrderError. Error message will state that
      first_tag came before second_tag.
      */
      this.error = true
      const msg = ERROR_MESSAGES['A_BEFORE_B'].replace('{0}', first_tag).replace('{1}', second_tag).replace('{2}', line)
      this.logger.log(msg)
    }


    p_lic_xref_1(p) {
      /*lic_xref : LICS_CRS_REF LINE*/
      // @TODO: Fix this
      try {
        const value = p[2]
        this.builder.add_lic_xref(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('LicenseCrossReference', 'LicenseName', p.lineno(1))
        }
      }

    }


    p_lic_xref_2(p) {
      /*lic_xref : LICS_CRS_REF error*/
      this.error = true
      const msg = ERROR_MESSAGES['LICS_CRS_REF_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_lic_comment_1(p) {
      /*lic_comment : LICS_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_lic_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('LicenseComment', 'LicenseID', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('LicenseComment', p.lineno(1))
        }
      }
    }


    p_lic_comment_2(p) {
      /*lic_comment : LICS_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['LICS_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_extr_lic_name_1(p) {
      /*extr_lic_name : LICS_NAME extr_lic_name_value*/
      try {
        this.builder.set_lic_name(this.document, p[2])
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('LicenseName', 'LicenseID', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.order_error('LicenseName', p.lineno(1))
        }
      }
    }


    p_extr_lic_name_2(p) {
      /*extr_lic_name : LICS_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['LICS_NAME_VALE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_extr_lic_name_value_1(p) {
      /*extr_lic_name_value : LINE*/
      p[0] = p[1]
    }


    p_extr_lic_name_value_2(p) {
      /*extr_lic_name_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_extr_lic_text_1(p) {
      /*extr_lic_text : LICS_TEXT TEXT*/
      try {
        const value = p[2]
        this.builder.set_lic_text(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ExtractedText', 'LicenseID', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('ExtractedText', p.lineno(1))
        }
      }
    }


    p_extr_lic_text_2(p) {
      /*extr_lic_text : LICS_TEXT error*/
      this.error = true
      const msg = ERROR_MESSAGES['LICS_TEXT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_extr_lic_id_1(p) {
      /*extr_lic_id : LICS_ID LINE*/
      try {
        const value = p[2]
        this.builder.set_lic_id(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          this.error = true;
          const msg = ERROR_MESSAGES['LICS_ID_VALUE'].format(p.lineno(1));
          this.logger.log(msg);
        }
      }
    }


    p_extr_lic_id_2(p) {
      /*extr_lic_id : LICS_ID error*/
      // @TODO: Fix this
      this.error = true;
      const msg = ERROR_MESSAGES['LICS_ID_VALUE'].replace("{0}", p.lineno(1));
      this.logger.log(msg);
    }


    p_uknown_tag(p) {
      /*unknown_tag : UNKNOWN_TAG LINE*/
      // @TODO: Fix this
      this.error = true
      const msg = ERROR_MESSAGES['UNKNOWN_TAG'].replace('{0}', p[1]).replace('{1}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_artifact_1(p) {
      /*file_artifact : prj_name_art file_art_rest
                       | prj_name_art
      */
      return
    }


    p_file_artificat_2(p) {
      /*file_artifact : prj_name_art error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_ART_OPT_ORDER'].replace('{0}', p.lineno(2))
      this.logger.log(msg)
    }


    p_file_art_rest(p) {
      /*file_art_rest : prj_home_art prj_uri_art
                       | prj_uri_art prj_home_art
                       | prj_home_art
                       | prj_uri_art
      */
      return
    }


    p_prj_uri_art_1(p) {
      /*prj_uri_art : ART_PRJ_URI UN_KNOWN*/
      try {
        this.builder.set_file_atrificat_of_project(this.document,
            'uri', utils.UnKnown())
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ArtificatOfProjectURI', 'FileName', p.lineno(1))
        }
      }
    }


    p_prj_uri_art_2(p) {
      /*prj_uri_art : ART_PRJ_URI LINE*/
      try {
        const value = p[2];
        this.builder.set_file_atrificat_of_project(this.document, 'uri', value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ArtificatOfProjectURI', 'FileName', p.lineno(1));
        }
      }
    }


    p_prj_uri_art_3(p) {
      /*prj_uri_art : ART_PRJ_URI error*/
      this.error = true
      const msg = ERROR_MESSAGES['ART_PRJ_URI_VALUE'].replace('{0', p.lineno(1))
      this.logger.log(msg)
    }


    p_prj_home_art_1(p) {
      /*prj_home_art : ART_PRJ_HOME LINE*/
      try {
        this.builder.set_file_atrificat_of_project(this.document, 'home', p[2])
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ArtificatOfProjectHomePage', 'FileName', p.lineno(1))
        }
      }
    }


    p_prj_home_art_2(p) {
      /*prj_home_art : ART_PRJ_HOME UN_KNOWN*/
      try {
        this.builder.set_file_atrificat_of_project(this.document,
            'home', utils.UnKnown())
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ArtifactOfProjectName', 'FileName', p.lineno(1))
        }
      }
    }


    p_prj_home_art_3(p) {
      /*prj_home_art : ART_PRJ_HOME error*/
      this.error = true
      const msg = ERROR_MESSAGES['ART_PRJ_HOME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_prj_name_art_1(p) {
      /*prj_name_art : ART_PRJ_NAME LINE*/
      try {
        const value = p[2];
        this.builder.set_file_atrificat_of_project(this.document, 'name', value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ArtifactOfProjectName', 'FileName', p.lineno(1))
        }
      }
    }


    p_prj_name_art_2(p) {
      /*prj_name_art : ART_PRJ_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['ART_PRJ_NAME_VALUE'].replace('{0}', p.lineno())
      this.logger.log(msg)
    }


    p_file_dep_1(p) {
      /*file_dep : FILE_DEP LINE*/
      try {
        const value = p[2];
        this.builder.add_file_dep(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileDependency', 'FileName', p.lineno(1))
        }
      }
    }


    p_file_dep_2(p) {
      /*file_dep : FILE_DEP error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_DEP_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_contrib_1(p) {
      /*file_contrib : FILE_CONTRIB LINE*/
      try {
        const value = p[2];
        this.builder.add_file_contribution(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileContributor', 'FileName', p.lineno(1))
        }
      }
    }


    p_file_contrib_2(p) {
      /*file_contrib : FILE_CONTRIB error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_CONTRIB_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_notice_1(p) {
      /*file_notice : FILE_NOTICE TEXT*/
      try {
        const value = p[2];
        this.builder.add_file_contribution(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileNotice', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('FileNotice', p.lineno(1))
        }
      }
    }


    p_file_notice_2(p) {
      /*file_notice : FILE_NOTICE error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_NOTICE_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }



    p_file_cr_text_1(p) {
      /*file_cr_text : FILE_CR_TEXT file_cr_value*/
      try {
        this.builder.set_file_copyright(this.document, p[2])
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileCopyrightText', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('FileCopyrightText', p.lineno(1))
        }
      }
    }


    p_file_cr_text_2(p) {
      /*file_cr_text : FILE_CR_TEXT error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_CR_TEXT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_cr_value_1(p) {
      /*file_cr_value : TEXT*/
       p[0] = p[1];
    }


    p_file_cr_value_2(p) {
      /*file_cr_value : NONE*/
      p[0] = SPDXNone()
    }


    p_file_cr_value_3(p) {
      /*file_cr_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_file_lics_comment_1(p) {
      /*file_lics_comment : FILE_LICS_COMMENT TEXT*/
      try {
        const value = p[2];
        this.builder.set_file_license_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('LicenseComments', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('LicenseComments', p.lineno(1))
        }
      }
    }


    p_file_lics_comment_2(p) {
      /*file_lics_comment : FILE_LICS_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_LICS_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_lics_info_1(p) {
      /*file_lics_info : FILE_LICS_INFO file_lic_info_value*/
      try {
        this.builder.set_file_license_in_file(this.document, p[2])
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('LicenseInfoInFile', 'FileName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['FILE_LICS_INFO_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_file_lics_info_2(p) {
      /*file_lics_info : FILE_LICS_INFO error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_LICS_INFO_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_lic_info_value_1(p) {
      /*file_lic_info_value : NONE*/
      p[0] = SPDXNone()
    }


    p_file_lic_info_value_2(p) {
      /*file_lic_info_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    // # License Identifier
    p_file_lic_info_value_3(p) {
      /*file_lic_info_value : LINE*/
      const value = p[1]
      p[0] = document.License.from_identifier(value)
    }


    p_conc_license_1(p) {
      /*conc_license : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_conc_license_2(p) {
      /*conc_license : NONE*/
      p[0] = SPDXNone()
    }


    p_conc_license_3(p) {
      /*conc_license : LINE*/
      const value = p[1]
      ref_re = re.compile('LicenseRef-.+', re.UNICODE)
      // if(p[1] in config.LICENSE_MAP.keys()) or (ref_re.match(p[1]) is not None) {
      //   p[0] = document.License.from_identifier(value)
      // }  else {
      //   p[0] = this.license_list_parser.parse(value)
      // }
    }


    p_file_name_1(p) {
      /*file_name : FILE_NAME LINE*/
      try {
        const value = p[2]
        this.builder.set_file_name(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileName', 'PackageName', p.lineno(1))
        }
      }
    }


    p_file_name_2(p) {
      /*file_name : FILE_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_NAME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_spdx_id(p) {
      /*spdx_id : SPDX_ID LINE*/
      const value = p[2]
      if(!this.builder.doc_spdx_id_set) {
          this.builder.set_doc_spdx_id(this.document, value)
        } else {
          this.builder.set_file_spdx_id(this.document, value)
        }
    }


    p_file_comment_1(p) {
      /*file_comment : FILE_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_file_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileComment', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('FileComment', p.lineno(1))
        }
      }
    }


    p_file_comment_2(p) {
      /*file_comment : FILE_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_type_1(p) {
      /*file_type : FILE_TYPE file_type_value*/
      try {
        this.builder.set_file_type(this.document, p[2])
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileType', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('FileType', p.lineno(1))
        }
      }
    }


    p_file_type_2(p) {
      /*file_type : FILE_TYPE error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_TYPE_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_chksum_1(p) {
      /*file_chksum : FILE_CHKSUM CHKSUM*/
      try {
        const value = p[2]
        this.builder.set_file_chksum(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('FileChecksum', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('FileChecksum', p.lineno(1))
        }
      }
    }


    p_file_chksum_2(p) {
      /*file_chksum : FILE_CHKSUM error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_CHKSUM_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_conc_1(p) {
      /*file_conc : FILE_LICS_CONC conc_license*/
      try {
        this.builder.set_concluded_license(this.document, p[2])
      } catch (e) {
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['FILE_LICS_CONC_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
        if(e instanceof OrderError) {
          this.order_error('LicenseConcluded', 'FileName', p.lineno(1))
        }
        if(e instanceof CardinalityError) {
          this.more_than_one_error('LicenseConcluded', p.lineno(1))
        }
      }
    }


    p_file_conc_2(p) {
      /*file_conc : FILE_LICS_CONC error*/
      this.error = true
      const msg = ERROR_MESSAGES['FILE_LICS_CONC_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_file_type_value(p) {
      /*file_type_value : OTHER
                         | SOURCE
                         | ARCHIVE
                         | BINARY
      */
      p[0] = p[1]
    }


    p_pkg_desc_1(p) {
      /*pkg_desc : PKG_DESC TEXT*/
      try {
        const value = p[2]
        this.builder.set_pkg_desc(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageDescription', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageDescription', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_desc_2(p) {
      /*pkg_desc : PKG_DESC error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_DESC_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_summary_1(p) {
      /*pkg_summary : PKG_SUM TEXT*/
      try {
        const value = p[2]
        this.builder.set_pkg_summary(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageSummary', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageSummary', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_summary_2(p) {
      /*pkg_summary : PKG_SUM error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_SUM_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_cr_text_1(p) {
      /*pkg_cr_text : PKG_CPY_TEXT pkg_cr_text_value*/
      try {
        this.builder.set_pkg_cr_text(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageCopyrightText', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageCopyrightText', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_cr_text_2(p) {
      /*pkg_cr_text : PKG_CPY_TEXT error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_CPY_TEXT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_cr_text_value_1(p) {
      /*pkg_cr_text_value : TEXT*/
       p[0] = p[1]
    }


    p_pkg_cr_text_value_2(p) {
      /*pkg_cr_text_value : NONE*/
      p[0] = SPDXNone()
    }


    p_pkg_cr_text_value_3(p) {
      /*pkg_cr_text_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_pkg_lic_comment_1(p) {
      /*pkg_lic_comment : PKG_LICS_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_pkg_license_comment(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageLicenseComments', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageLicenseComments', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_lic_comment_2(p) {
      /*pkg_lic_comment : PKG_LICS_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_LICS_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_lic_decl_1(p) {
      /*pkg_lic_decl : PKG_LICS_DECL conc_license*/
      try {
        this.builder.set_pkg_license_declared(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageLicenseDeclared', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageLicenseDeclared', 'PackageName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_LICS_DECL_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_lic_decl_2(p) {
      /*pkg_lic_decl : PKG_LICS_DECL error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_LICS_DECL_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_lic_ff_1(p) {
      /*pkg_lic_ff : PKG_LICS_FFILE pkg_lic_ff_value*/
      try {
        this.builder.set_pkg_license_declared(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageLicenseDeclared', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageLicenseInfoFromFiles', 'PackageName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_LIC_FFILE_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_lic_ff_value_1(p) {
      /*pkg_lic_ff_value : NONE*/
      p[0] = SPDXNone()
    }


    p_pkg_lic_ff_value_2(p) {
      /*pkg_lic_ff_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_pkg_lic_ff_value_3(p) {
      /*pkg_lic_ff_value : LINE*/
      const value = p[1]
      p[0] = document.License.from_identifier(value)
    }


    p_pkg_lic_ff_2(p) {
      /*pkg_lic_ff : PKG_LICS_FFILE error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_LIC_FFILE_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_lic_conc_1(p) {
      /*pkg_lic_conc : PKG_LICS_CONC conc_license*/
      try {
        this.builder.set_pkg_license_declared(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageLicenseConcluded', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageLicenseConcluded', 'PackageFileName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_LICS_CONC_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_lic_conc_2(p) {
      /*pkg_lic_conc : PKG_LICS_CONC error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_LICS_CONC_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_src_info_1(p) {
      /*pkg_src_info : PKG_SRC_INFO TEXT*/
      try {
        const value = p[2]
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageSourceInfo', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageSourceInfo', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_src_info_2(p) {
      /*pkg_src_info : PKG_SRC_INFO error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_SRC_INFO_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_chksum_1(p) {
      /*pkg_chksum : PKG_CHKSUM CHKSUM*/
      try {
        const value = p[2]
        this.builder.set_pkg_chk_sum(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageChecksum', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageChecksum', 'PackageFileName', p.lineno(1))
        }
      }
    }


    p_pkg_chksum_2(p) {
      /*pkg_chksum : PKG_CHKSUM error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_CHKSUM_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_verif_1(p) {
      /*pkg_verif : PKG_VERF_CODE LINE*/
      try {
        const value = p[2]
        this.builder.set_pkg_verif_code(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageVerificationCode', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageVerificationCode', 'PackageName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_VERF_CODE_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_verif_2(p) {
      /*pkg_verif : PKG_VERF_CODE error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_VERF_CODE_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_home_1(p) {
      /*pkg_home : PKG_HOME pkg_home_value*/
      try {
        this.builder.set_pkg_down_location(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageHomePage', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageHomePage', 'PackageName', p.lineno(1))
        }
      }
    }


    p_pkg_home_2(p) {
      /*pkg_home : PKG_HOME error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_HOME_VALUE']
      this.logger.log(msg)
    }


    p_pkg_home_value_1(p) {
      /*pkg_home_value : LINE*/
      p[0] = p[1]
    }


    p_pkg_home_value_2(p) {
      /*pkg_home_value : NONE*/
      p[0] = SPDXNone()
    }


    p_pkg_home_value_3(p) {
      /*pkg_home_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_pkg_down_location_1(p) {
      /*pkg_down_location : PKG_DOWN pkg_down_value*/
      try {
        this.builder.set_pkg_down_location(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageDownloadLocation', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageDownloadLocation', 'PackageName', p.lineno(1))
        }
      }
    }


    p_pkg_down_location_2(p) {
      /*pkg_down_location : PKG_DOWN error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_DOWN_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_down_value_1(p) {
      /*pkg_down_value : LINE */
       p[0] = p[1]
    }


    p_pkg_down_value_2(p) {
      /*pkg_down_value : NONE*/
      p[0] = SPDXNone()
    }


    p_pkg_down_value_3(p) {
      /*pkg_down_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_pkg_orig_1(p) {
      /*pkg_orig : PKG_ORIG pkg_supplier_values*/
      try {
        this.builder.set_pkg_originator(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageOriginator', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageOriginator', 'PackageName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_ORIG_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_orig_2(p) {
      /*pkg_orig : PKG_ORIG error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_ORIG_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_supplier_1(p) {
      /*pkg_supplier : PKG_SUPPL pkg_supplier_values*/
      try {
        this.builder.set_pkg_supplier(this.document, p[2])
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageSupplier', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageSupplier', 'PackageName', p.lineno(1))
        }
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['PKG_SUPPL_VALUE'].format(p.lineno(1))
          this.logger.log(msg)
        }
      }
    }


    p_pkg_supplier_2(p) {
      /*pkg_supplier : PKG_SUPPL error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_SUPPL_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_pkg_supplier_values_1(p) {
      /*pkg_supplier_values : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_pkg_supplier_values_2(p) {
      /*pkg_supplier_values : entity*/
      p[0] = p[1]
    }


    p_pkg_file_name(p) {
      /*pkg_file_name : PKG_FILE_NAME LINE*/
      try {
        const value = p[2]
        this.builder.set_pkg_file_name(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageFileName', p.lineno(1))
        }
        if(e instanceof OrderError) {
          this.order_error('PackageFileName', 'PackageName', p.lineno(1))
        }
      }
    }


    p_pkg_file_name_1(p) {
      /*pkg_file_name : PKG_FILE_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_FILE_NAME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_package_version_1(p) {
      /*package_version : PKG_VERSION LINE*/
      try {
        const value = p[2]
        this.builder.set_pkg_vers(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageVersion', p.lineno(1))
        }
        if(e instanceof OrderError) {
            this.order_error('PackageVersion', 'PackageName', p.lineno(1))
        }
      }
    }


    p_package_version_2(p) {
      /*package_version : PKG_VERSION error*/
      this.error = true
      const msg = ERROR_MESSAGES['PKG_VERSION_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_package_name(p) {
      /*package_name : PKG_NAME LINE*/
      try {
        const value = p[2]
        this.builder.create_package(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('PackageName', p.lineno(1))
        }
      }
    }


    p_package_name_1(p) {
      /*package_name : PKG_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['PACKAGE_NAME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snip_spdx_id(p) {
      /*snip_spdx_id : SNIPPET_SPDX_ID LINE*/
      try {
        const value = p[2]
        this.builder.create_snippet(this.document, value)
      } catch (e) {
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['SNIP_SPDX_ID_VALUE'].format(p.lineno(2))
        this.logger.log(msg)
    }
    }
    }


    p_snip_spdx_id_1(p) {
      /*snip_spdx_id : SNIPPET_SPDX_ID error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_SPDX_ID_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_name(p) {
      /*snip_name : SNIPPET_NAME LINE*/
      try {
        const value = p[2]
        this.builder.set_snippet_name(this.document, value)
      } catch (e) {
      if(e instanceof OrderError) {
        this.order_error('SnippetName', 'SnippetSPDXID', p.lineno(1))
    }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('SnippetName', p.lineno(1))
  }
    }
    }


    p_snippet_name_1(p) {
      /*snip_name : SNIPPET_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIPPET_NAME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_comment(p) {
      /*snip_comment : SNIPPET_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_snippet_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('SnippetComment', 'SnippetSPDXID', p.lineno(1))
      }
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['SNIP_COMMENT_VALUE'].format(p.lineno(2))
        this.logger.log(msg)
    }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('SnippetComment', p.lineno(1))
  }
    }
    }


    p_snippet_comment_1(p) {
      /*snip_comment : SNIPPET_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_cr_text(p) {
      /*snip_cr_text : SNIPPET_CR_TEXT snip_cr_value*/
      try {
        const value = p[2]
         this.builder.add_review_date(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('SnippetCopyrightText', 'SnippetSPDXID', p.lineno(1))
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('SnippetCopyrightText', p.lineno(1))
    }
    if(e instanceof SPDXValueError) {
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_COPYRIGHT_VALUE'].format(p.lineno(2))
      this.logger.log(msg)
  }
    }
    }


    p_snippet_cr_text_1(p) {
      /*snip_cr_text : SNIPPET_CR_TEXT error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_COPYRIGHT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_cr_value_1(p) {
      /*snip_cr_value : TEXT*/
      p[0] = p[1]
    }


    p_snippet_cr_value_2(p) {
      /*snip_cr_value : NONE*/
      p[0] = SPDXNone()
    }


    p_snippet_cr_value_3(p) {
      /*snip_cr_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_snippet_lic_comment(p) {
      /*snip_lic_comment : SNIPPET_LICS_COMMENT TEXT*/
      try {
        const value = p[2]
         this.builder.set_snippet_lic_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('SnippetLicenseComments', 'SnippetSPDXID', p.lineno(1))
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('SnippetLicenseComments', p.lineno(1))
    }
    if(e instanceof SPDXValueError) {
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_COMMENT_VALUE'].format(p.lineno(2))
      this.logger.log(msg)
  }
    }
    }


    p_snippet_lic_comment_1(p) {
      /*snip_lic_comment : SNIPPET_LICS_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_COMMENT_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snip_from_file_spdxid(p) {
      /*snip_file_spdx_id : SNIPPET_FILE_SPDXID LINE*/
      try {
        const value = p[2]
         this.builder.set_snippet_lic_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('SnippetFromFileSPDXID', 'SnippetSPDXID', p.lineno(1))
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('SnippetFromFileSPDXID', p.lineno(1))
    }
    if(e instanceof SPDXValueError) {
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_FILE_SPDXID_VALUE'].format(p.lineno(2))
      this.logger.log(msg)
  }
    }
    }


    p_snip_from_file_spdxid_1(p) {
      /*snip_file_spdx_id : SNIPPET_FILE_SPDXID error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_FILE_SPDXID_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_concluded_license(p) {
      /*snip_lics_conc : SNIPPET_LICS_CONC conc_license*/
      try {
        const value = p[2]
         this.builder.set_snippet_lic_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('SnippetLicenseConcluded',
                           'SnippetSPDXID', p.lineno(1))
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('SnippetLicenseConcluded', p.lineno(1))
    }
    if(e instanceof SPDXValueError) {
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_CONC_VALUE'].format(p.lineno(1))
      this.logger.log(msg)
  }
    }
    }


    p_snippet_concluded_license_1(p) {
      /*snip_lics_conc : SNIPPET_LICS_CONC error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_CONC_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snippet_lics_info(p) {
      /*snip_lics_info : SNIPPET_LICS_INFO snip_lic_info_value*/
      try {
        const value = p[2]
         this.builder.add_review_date(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error(
              'LicenseInfoInSnippet', 'SnippetSPDXID', p.lineno(1))
      }
    if(e instanceof CardinalityError) {
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_INFO_VALUE'].format(p.lineno(1))
      this.logger.log(msg)
  }
    }
    }


    p_snippet_lics_info_1(p) {
      /*snip_lics_info : SNIPPET_LICS_INFO error*/
      this.error = true
      const msg = ERROR_MESSAGES['SNIP_LICS_INFO_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_snip_lic_info_value_1(p) {
      /*snip_lic_info_value : NONE*/
      p[0] = SPDXNone()
    }


    p_snip_lic_info_value_2(p) {
      /*snip_lic_info_value : NO_ASSERT*/
      p[0] = NoAssert()
    }


    p_snip_lic_info_value_3(p) {
      /*snip_lic_info_value : LINE*/
      const value = p[1]
      p[0] = document.License.from_identifier(value)
    }


    p_reviewer_1(p) {
      /*reviewer : REVIEWER entity*/
      this.builder.add_reviewer(this.document, p[2])
    }


    p_reviewer_2(p) {
      /*reviewer : REVIEWER error*/
      this.error = true
      const msg = ERROR_MESSAGES['REVIEWER_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_review_date_1(p) {
      /*review_date : REVIEW_DATE DATE*/
      try {
        const value = p[2]
         this.builder.add_review_date(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ReviewDate', 'Reviewer', p.lineno(1))
      }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('ReviewDate', p.lineno(1))
  }
    }
    }


    p_review_date_2(p) {
      /*review_date : REVIEW_DATE error*/
      this.error = true
      const msg = ERROR_MESSAGES['REVIEW_DATE_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_review_comment_1(p) {
      /*review_comment : REVIEW_COMMENT TEXT*/
      try {
        const value = p[2]
         this.builder.add_review_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('ReviewComment', 'Reviewer', p.lineno(1))
      }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('ReviewComment', p.lineno(1))
  }
    }
    }


    p_review_comment_2(p) {
      /*review_comment : REVIEW_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['REVIEW_COMMENT_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_annotator_1(p) {
      /*annotator : ANNOTATOR entity*/
      this.builder.add_annotator(this.document, p[2])
    }


    p_annotator_2(p) {
      /*annotator : ANNOTATOR error*/
      this.error = true
      const msg = ERROR_MESSAGES['ANNOTATOR_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_annotation_date_1(p) {
      /*annotation_date : ANNOTATION_DATE DATE*/
      try {
        const value = p[2]
         this.builder.add_annotation_date(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('AnnotationDate', 'Annotator', p.lineno(1))
      }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('AnnotationDate', p.lineno(1))
  }
    }
    }


    p_annotation_date_2(p) {
      /*annotation_date : ANNOTATION_DATE error*/
      this.error = true
      const msg = ERROR_MESSAGES['ANNOTATION_DATE_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_annotation_comment_1(p) {
      /*annotation_comment : ANNOTATION_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.add_annotation_comment(this.document, value)
      } catch (e) {
        if(e instanceof OrderError) {
          this.order_error('AnnotationComment', 'Annotator', p.lineno(1))
      }
    if(e instanceof CardinalityError) {
      this.more_than_one_error('AnnotationComment', p.lineno(1))
  }
    }
    }


    p_annotation_comment_2(p) {
      /*annotation_comment : ANNOTATION_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['ANNOTATION_COMMENT_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_annotation_type_1(p) {
      /*annotation_type : ANNOTATION_TYPE LINE*/
      try {
        const value = p[2]
        this.builder.add_annotation_type(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
           this.more_than_one_error('AnnotationType', p.lineno(1))
      }
      if(e instanceof OrderError) {
        this.order_error('AnnotationType', 'Annotator', p.lineno(1))
      }
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['ANNOTATION_TYPE_VALUE'].format(p.lineno(1))
        this.logger.log(msg)
    }
    }
    }


    p_annotation_type_2(p) {
      /*annotation_type : ANNOTATION_TYPE error*/
      this.error = true
      const msg = ERROR_MESSAGES['ANNOTATION_TYPE_VALUE'].replace('{0}',
          p.lineno(1))
      this.logger.log(msg)
    }


    p_annotation_spdx_id_1(p) {
      /*annotation_spdx_id : ANNOTATION_SPDX_ID LINE*/
      try {
        const value = p[2]
        this.builder.set_annotation_spdx_id(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('SPDXREF', p.lineno(1))
      }
      if(e instanceof OrderError) {
        this.order_error('SPDXREF', 'Annotator', p.lineno(1))
    }
    }
    }


    p_annotation_spdx_id_2(p) {
      /*annotation_spdx_id : ANNOTATION_SPDX_ID error*/
      this.error = true
      const msg = ERROR_MESSAGES['ANNOTATION_SPDX_ID_VALUE'].replace('{0}',
          p.lineno(1))
      this.logger.log(msg)
    }


    p_lics_list_ver_1(p) {
      /*locs_list_ver : LIC_LIST_VER LINE*/
      try {
        const value = p[2]
        this.builder.set_lics_list_ver(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('LicenseListVersion', p.lineno(1))
      }
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['LIC_LIST_VER_VALUE'].format(
            p[2], p.lineno(2))
        this.logger.log(msg)
    }
    }
    }


    p_lics_list_ver_2(p) {
      /*locs_list_ver : LIC_LIST_VER error*/
      this.error = true
      const msg = ERROR_MESSAGES['LIC_LIST_VER_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_doc_comment_1(p) {
      /*doc_comment : DOC_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_doc_comment(this.document, value)
      } catch (e) {
      if(e instanceof CardinalityError) {
        this.more_than_one_error('DocumentComment', p.lineno(1))
    }
    }
    }


    p_doc_comment_2(p) {
      /*doc_comment : DOC_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['DOC_COMMENT_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_doc_namespace_1(p) {
      /*doc_namespace : DOC_NAMESPACE LINE*/
      try {
        const value = p[2]
        this.builder.set_doc_namespace(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['DOC_NAMESPACE_VALUE'].format(p[2], p.lineno(2))
          this.logger.log(msg)
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('DocumentNamespace', p.lineno(1))
    }
    }
    }


    p_doc_namespace_2(p) {
      /*doc_namespace : DOC_NAMESPACE error*/
      this.error = true
      const msg = ERROR_MESSAGES['DOC_NAMESPACE_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_data_license_1(p) {
      /*data_lics : DOC_LICENSE LINE*/
      try {
        const value = p[2]
        this.builder.set_doc_data_lics(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          this.error = true
          const msg = ERROR_MESSAGES['DOC_LICENSE_VALUE'].format(p[2], p.lineno(2))
          this.logger.log(msg)
      }
      if(e instanceof CardinalityError) {
        this.more_than_one_error('DataLicense', p.lineno(1))
    }
    }
    }


    p_data_license_2(p) {
      /*data_lics : DOC_LICENSE error*/
      this.error = true
      const msg = ERROR_MESSAGES['DOC_LICENSE_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_doc_name_1(p) {
      /*doc_name : DOC_NAME LINE*/
      try {
        const value = p[2]
        this.builder.set_doc_name(this.document, value)
      } catch (e) {
      if(e instanceof CardinalityError) {
        this.more_than_one_error('DocumentName', p.lineno(1))
    }
    }
    }


    p_doc_name_2(p) {
      /*doc_name : DOC_NAME error*/
      this.error = true
      const msg = ERROR_MESSAGES['DOC_NAME_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_ext_doc_refs_1(p) {
      /*ext_doc_ref : EXT_DOC_REF DOC_REF_ID DOC_URI EXT_DOC_REF_CHKSUM*/
      try {
        const doc_ref_id = p[2]
        const doc_uri = p[3]
        const ext_doc_chksum = p[4]
        this.builder.add_ext_doc_refs(this.document, doc_ref_id, doc_uri,
                                  ext_doc_chksum)
      } catch (e) {
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['EXT_DOC_REF_VALUE'].format(p.lineno(2))
        this.logger.log(msg)
    }
    }

    }


    p_ext_doc_refs_2(p) {
      /*ext_doc_ref : EXT_DOC_REF error*/
      this.error = true
      const msg = ERROR_MESSAGES['EXT_DOC_REF_VALUE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_spdx_version_1(p) {
      /*spdx_version : DOC_VERSION LINE*/
      try {
        const value = p[2]
        this.builder.set_doc_version(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('SPDXVersion', p.lineno(1))
      }
      if(e instanceof SPDXValueError) {
        this.error = true
        const msg = ERROR_MESSAGES['DOC_VERSION_VALUE'].format(p[2], p.lineno(1))
        this.logger.log(msg)
    }
    }
    }


    p_spdx_version_2(p) {
      /*spdx_version : DOC_VERSION error*/
      this.error = true
      const msg = ERROR_MESSAGES['DOC_VERSION_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_creator_comment_1(p) {
      /*creator_comment : CREATOR_COMMENT TEXT*/
      try {
        const value = p[2]
        this.builder.set_creation_comment(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('CreatorComment', p.lineno(1))
      }
    }
    }


    p_creator_comment_2(p) {
      /*creator_comment : CREATOR_COMMENT error*/
      this.error = true
      const msg = ERROR_MESSAGES['CREATOR_COMMENT_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_creator_1(p) {
      /*creator : CREATOR entity*/
      this.builder.add_creator(this.document, p[2])
    }


    p_creator_2(p) {
      /*creator : CREATOR error*/
      this.error = true
      const msg = ERROR_MESSAGES['CREATOR_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_created_1(p) {
      /*created : CREATED DATE*/
      try {
        const value = p[2]
        this.builder.set_created_date(this.document, value)
      } catch (e) {
        if(e instanceof CardinalityError) {
          this.more_than_one_error('Created', p.lineno(1))
      }
    }
    }


    p_created_2(p) {
      /*created : CREATED error*/
      this.error = true
      const msg = ERROR_MESSAGES['CREATED_VALUE_TYPE'].replace('{0}', p.lineno(1))
      this.logger.log(msg)
    }


    p_entity_1(p) {
      /*entity : TOOL_VALUE
      */
      try {
        const value = p[1]
        p[0] = this.builder.build_tool(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          msg = ERROR_MESSAGES['TOOL_VALUE'].format(p[1], p.lineno(1))
          this.logger.log(msg)
          this.error = true
          p[0] = None
      }
    }
  }


    p_entity_2(p) {
      /*entity : ORG_VALUE
      */
      try {
        const value = p[1]
        p[0] = this.builder.build_org(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          const msg = ERROR_MESSAGES['ORG_VALUE'].format(p[1], p.lineno(1))
          this.logger.log(msg)
          this.error = true
          p[0] = None
      }
    }
    }


    p_entity_3(p) {
      /*entity : PERSON_VALUE
      */
      try {
        const value = p[1]
        p[0] = this.builder.build_person(this.document, value)
      } catch (e) {
        if(e instanceof SPDXValueError) {
          msg = ERROR_MESSAGES['PERSON_VALUE'].format(p[1], p.lineno(1))
          this.logger.log(msg)
          this.error = true
          p[0] = None
      }
    }
    }


    p_error(p) {
      return
    }

    // build(**kwargs) {}
    //     this.lex = Lexer()
    //     this.lex.build(reflags=re.UNICODE)
    //     this.yacc = yacc.yacc(module=**kwargs)
    //
    // parse(text) {}
    //     this.document = document.Document()
    //     this.error = false
    //     this.yacc.parse(text, lexer=this.lex)
    //     # FIXME: this state does not make sense
    //     this.builder.reset()
    //     validation_messages = []
    //     # Report extra errors if this.error is false otherwise there will be
    //     # redundent messages
    //     validation_messages = this.document.validate(validation_messages)
    //     if not this.error:
    //         if validation_messages:
    //             for msg in validation_messages:
    //                 this.logger.log(msg)
    //             this.error = true
    //     return this.document, this.error

}
