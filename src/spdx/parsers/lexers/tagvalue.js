// SPDX-License-Identifier: MIT

const moo = require('moo');


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
      let lexer = moo.compile({
        openTag: ['<text>'],
        closeTag: ['</text>'],
        string:  /"(?:\\["\\]|[^\n"\\])*"/,
      })
      lexer.reset(t)
    }

    t_text_end(t) {
      let lexer = moo.compile({
        string:  /'<\/text>\s*'/,
      })
      lexer.reset(t)
    }

    t_text_any(t) {
      let lexer = moo.compile({
        string:  /"(?:\\["\\]|[^\n"\\])*"/,
      })
      lexer.reset(t)
    }

    t_text_error(t) {
      console.log('Lexer error in text state')
    }

    t_CHKSUM(t) {
      let lexer = moo.compile({
        string:  /':\s*SHA1:\s*[a-f0-9]{40,40}'/,
      })
      lexer.reset(t)
    }

    t_DOC_REF_ID(t) {
      let lexer = moo.compile({
        string:  /':\s*DocumentRef-([A-Za-z0-9\+\.\-]+)'/,
      })
      lexer.reset(t)
    }

    t_DOC_URI(t) {
      let lexer = moo.compile({
        string:  /'\s*((ht|f)tps?:\/\/\S*)'/,
      })
      lexer.reset(t)
    }

    t_EXT_DOC_REF_CHKSUM(t) {
      let lexer = moo.compile({
        string:  /'\s*SHA1:\s*[a-f0-9]{40,40}'/,
      })
      lexer.reset(t)
    }

    t_TOOL_VALUE(t) {
      let lexer = moo.compile({
        string:  /':\s*Tool:.+'/,
      })
      lexer.reset(t)
    }

    t_ORG_VALUE(t) {
      let lexer = moo.compile({
        string:  /':\s*Organization:.+'/,
      })
      lexer.reset(t)
    }

    t_PERSON_VALUE(t) {
      let lexer = moo.compile({
        string:  /':\s*Person:.+'/,
      })
      lexer.reset(t)
    }

    t_DATE(t) {
      let lexer = moo.compile({
        string:  /':\s*\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ'/,
      })
      lexer.reset(t)
    }

    t_KEYWORD_AS_TAG(t) {
      let lexer = moo.compile({
        string:  /'[a-zA-Z]+'/,
      })
      lexer.reset(t)
    }

    t_LINE_OR_KEYWORD_VALUE(t) {
      let lexer = moo.compile({
        string:  /':.+'/,
      })
      lexer.reset(t)
    }

    t_comment(t) {
      let lexer = moo.compile({
        string:  /'\#.*'/,
      })
      lexer.reset(t)
    }

    t_newline(t) {
      let lexer = moo.compile({
        string:  /'\n+'/,
      })
      lexer.reset(t)
    }

    t_whitespace(t) {
      let lexer = moo.compile({
        string:  /'\s+'/,
        lexError: moo.error,
      })
      lexer.reset(t)
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
