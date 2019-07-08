// SPDX-License-Identifier: MIT



export default class Lexer {

  constructor() {
    const reserved = {
          // # Top level fields
          'SPDXVersion': 'DOC_VERSION',
          'DataLicense': 'DOC_LICENSE',
          'DocumentName': 'DOC_NAME',
          'SPDXID': 'SPDX_ID',
          'DocumentComment': 'DOC_COMMENT',
          'DocumentNamespace': 'DOC_NAMESPACE',
          'ExternalDocumentRef': 'EXT_DOC_REF',
          // # Creation info
          'Creator': 'CREATOR',
          'Created': 'CREATED',
          'CreatorComment': 'CREATOR_COMMENT',
          'LicenseListVersion': 'LIC_LIST_VER',
          // # Review info
          'Reviewer': 'REVIEWER',
          'ReviewDate': 'REVIEW_DATE',
          'ReviewComment': 'REVIEW_COMMENT',
          // # Annotation info
          'Annotator': 'ANNOTATOR',
          'AnnotationDate': 'ANNOTATION_DATE',
          'AnnotationComment': 'ANNOTATION_COMMENT',
          'AnnotationType': 'ANNOTATION_TYPE',
          'SPDXREF': 'ANNOTATION_SPDX_ID',
          // # Package Fields
          'PackageName': 'PKG_NAME',
          'PackageVersion': 'PKG_VERSION',
          'PackageDownloadLocation': 'PKG_DOWN',
          'PackageSummary': 'PKG_SUM',
          'PackageSourceInfo': 'PKG_SRC_INFO',
          'PackageFileName': 'PKG_FILE_NAME',
          'PackageSupplier': 'PKG_SUPPL',
          'PackageOriginator': 'PKG_ORIG',
          'PackageChecksum': 'PKG_CHKSUM',
          'PackageVerificationCode': 'PKG_VERF_CODE',
          'PackageDescription': 'PKG_DESC',
          'PackageLicenseDeclared': 'PKG_LICS_DECL',
          'PackageLicenseConcluded': 'PKG_LICS_CONC',
          'PackageLicenseInfoFromFiles': 'PKG_LICS_FFILE',
          'PackageLicenseComments': 'PKG_LICS_COMMENT',
          'PackageCopyrightText': 'PKG_CPY_TEXT',
          'PackageHomePage': 'PKG_HOME',
          // # Files
          'FileName': 'FILE_NAME',
          'FileType': 'FILE_TYPE',
          'FileChecksum': 'FILE_CHKSUM',
          'LicenseConcluded': 'FILE_LICS_CONC',
          'LicenseInfoInFile': 'FILE_LICS_INFO',
          'FileCopyrightText': 'FILE_CR_TEXT',
          'LicenseComments': 'FILE_LICS_COMMENT',
          'FileComment': 'FILE_COMMENT',
          'FileNotice': 'FILE_NOTICE',
          'FileContributor': 'FILE_CONTRIB',
          'FileDependency': 'FILE_DEP',
          'ArtifactOfProjectName': 'ART_PRJ_NAME',
          'ArtifactOfProjectHomePage': 'ART_PRJ_HOME',
          'ArtifactOfProjectURI': 'ART_PRJ_URI',
          // # License
          'LicenseID': 'LICS_ID',
          'ExtractedText': 'LICS_TEXT',
          'LicenseName': 'LICS_NAME',
          'LicenseCrossReference': 'LICS_CRS_REF',
          'LicenseComment': 'LICS_COMMENT',
          // # Common
          'NOASSERTION': 'NO_ASSERT',
          'UNKNOWN': 'UN_KNOWN',
          'NONE': 'NONE',
          'SOURCE': 'SOURCE',
          'BINARY': 'BINARY',
          'ARCHIVE': 'ARCHIVE',
          'OTHER': 'OTHER'
      };
      const states = ['text', 'exclusive'];
      const tokens = ['TEXT', 'TOOL_VALUE', 'UNKNOWN_TAG',
                      'ORG_VALUE', 'PERSON_VALUE',
                      'DATE', 'LINE', 'CHKSUM', 'DOC_REF_ID',
                      'DOC_URI', 'EXT_DOC_REF_CHKSUM'].concat(Object.values(reserved))
    this.reserved = reserved;
  }

    t_text(t) {
      // let lexer = moo.compile({
      //
      // })
    }

    t_text_end(t) {

    }

    t_text_any(t) {

    }

    t_text_error(t) {

    }

    t_CHKSUM(t) {

    }

    t_DOC_REF_ID(t) {

    }

    t_DOC_URI(t) {

    }

    t_EXT_DOC_REF_CHKSUM(t) {

    }

    t_TOOL_VALUE(t) {

    }

    t_ORG_VALUE(t) {

    }

    t_DATE(t) {

    }

    t_KEYWORD_AS_TAG(t) {

    }

    t_LINE_OR_KEYWORD_VALUE(t) {

    }

    t_comment(t) {

    }

    t_newline(t) {

    }

    t_whitespace(t) {

    }

    build(t) {

    }

    token(t) {

    }

    input(t) {

    }

    t_error(t) {

    }

}
