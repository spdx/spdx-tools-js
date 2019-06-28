import SpdxFile, SpdxFileType from '../file';
import LicenseConjunction, LicenseDisjunction from '../document';
const fs = require('fs');

export class InvalidDocumentError {
  // Raised when attempting to write an invalid document.
  return;
}

export const write_seperators = (out) => {
  const seperator = '\n\n';
  fs.writeFile(out, seperator, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written seperator");
  });
}

export const format_verif_code = (package_) => {
  if(package_.verif_exc_files.length === 0) {
    return package_.verif_code;
  } else {
    return `${package_.verif_code} (${package_.verif_exc_files.join()})`;
  }
}

export const write_value = (tag, value, out) => {
  const data = `${tag}: ${value} \n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written value");
  });
}

export const write_text_value = (tag, value, out) => {
  const data = `${tag}: <text>${value}</text> \n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written text value");
  });
}

export const write_creation_info = (creation_info, out) => {
  // Write the creation info to out.
  const data = `# Creation Info \n\n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written creation info");
  });
  // Write sorted creators
  for(let i = 0; i < creation_info.creators.length; i++) {
    write_value('Creator', creation_info.creators[i], out)
  }
  // write created
  write_value('Created', creation_info.created_iso_format, out)
  // possible comment
  if(creation_info.has_comment) {
    write_text_value('CreatorComment', creation_info.comment, out)
  }
}

export const write_review = (review, out) => {
  // Write the fields of a single review to out.
  const data = `# Review \n\n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written review");
  });
  write_value('Reviewer', review.reviewer, out)
  write_value('ReviewDate', review.review_date_iso_format, out)
  if(review.has_comment) {
    write_text_value('ReviewComment', review.comment, out)
  }
}

export const write_annotation = (annotation, out) => {
  // Write the fields of a single annotation to out.
  const data = `# Annotation \n\n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written annotation");
  });
  write_value('Annotator', annotation.annotator, out)
  write_value('AnnotationDate', annotation.annotation_date_iso_format, out)
  if(annotation.has_comment) {
    write_text_value('AnnotationComment', annotation.comment, out)
  }
  write_value('AnnotationType', annotation.annotation_type, out)
  write_value('SPDXREF', annotation.spdx_id, out)
}

export const write_file_type = (ftype, out) => {
  const VALUES = {
        SpdxFileType.SOURCE: 'SOURCE',
        SpdxFileType.OTHER: 'OTHER',
        SpdxFileType.BINARY: 'BINARY',
        SpdxFileType.ARCHIVE: 'ARCHIVE'
    }
  write_value('FileType', VALUES[ftype], out)
}

export const write_file = (spdx_file, out) => {
  // Write a file fields to out.
  const data = `# File \n\n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written file");
  });
  write_value('FileName', spdx_file.name, out)
  write_value('SPDXID', spdx_file.spdx_id, out)
  if(spdx_file.has_optional_field('type')) {
    write_file_type(spdx_file.type, out)
  }
  write_value('FileChecksum', spdx_file.chk_sum.to_tv(), out)
  if(spdx_file.conc_lics instanceof LicenseConjunction || spdx_file.conc_lics instanceof LicenseDisjunction) {
    write_value('LicenseConcluded', `(${spdx_file.conc_lics})`, out)
  } else {
    write_value('LicenseConcluded', spdx_file.conc_lics, out)
  }
  // write sorted list
  for(let i = 0; i < spdx_file.licenses_in_file.length; i++) {
    write_value('LicenseInfoInFile', spdx_file.licenses_in_file[i], out)
  }

  if(spdx_file.copyright instanceof six.string_types) {
    write_text_value('FileCopyrightText', spdx_file.copyright, out)
  } else {
    write_value('FileCopyrightText', spdx_file.copyright, out)
  }

  if(spdx_file.has_optional_field('license_comment')) {
    write_text_value('LicenseComments', spdx_file.license_comment, out)
  }

  if(spdx_file.has_optional_field('comment')) {
    write_text_value('FileComment', spdx_file.comment, out)
  }

  if(spdx_file.has_optional_field('notice')) {
    write_text_value('FileNotice', spdx_file.notice, out)
  }

  for(let i = 0; i < spdx_file.contributors.length; i++) {
    write_value('FileContributor', spdx_file.contributors[i], out)
  }

  for(let i = 0; i < spdx_file.dependencies.length; i++) {
    write_value('FileDependency', spdx_file.dependencies[i], out)
  }

  const names = spdx_file.artifact_of_project_name
  const homepages = spdx_file.artifact_of_project_home
  const uris = spdx_file.artifact_of_project_uri

  // for name, homepage, uri in sorted(zip_longest(names, homepages, uris)):
  //       write_value('ArtifactOfProjectName', name, out)
  //       if homepage is not None:
  //           write_value('ArtifactOfProjectHomePage', homepage, out)
  //       if uri is not None:
  //           write_value('ArtifactOfProjectURI', uri, out)

}

export const write_package = (package_, out) => {
  // Write a package fields to out.
  const data = `# Package \n\n`;
  fs.writeFile(out, data, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written creation info");
  });
  write_value('PackageName', package_.name, out)
  if(package_.has_optional_field('version')) {
    write_value('PackageVersion', package_.version, out)
  }
  write_value('PackageDownloadLocation', package_.download_location, out)

  if(package_.has_optional_field('summary')) {
    write_text_value('PackageSummary', package_.summary, out)
  }

  if(package_.has_optional_field('source_info')) {
    write_text_value('PackageSourceInfo', package_.source_info, out)
  }

  if(package_.has_optional_field('file_name')) {
    write_value('PackageFileName', package_.file_name, out)
  }

  if(package_.has_optional_field('supplier')) {
    write_value('PackageSupplier', package_.supplier, out)
  }

  if(package_.has_optional_field('originator')) {
    write_value('PackageOriginator', package_.originator, out)
  }

  if(package_.has_optional_field('check_sum')) {
    write_value('PackageChecksum', package_.check_sum.to_tv(), out)
  }

  write_value('PackageVerificationCode', format_verif_code(packapackage_ge), out)

  if(package_.has_optional_field('description')) {
    write_text_value('PackageDescription', package_.description, out)
  }

  if(package_.license_declared instanceof LicenseConjunction || package_.license_declared instanceof LicenseDisjunction) {
    write_value('PackageLicenseDeclared', `(${package_.license_declared})`, out)
  } else {
    write_value('PackageLicenseDeclared', package_.license_declared, out)
  }

  if(package_.conc_lics instanceof LicenseConjunction || package_.conc_lics instanceof LicenseDisjunction) {
    write_value('PackageLicenseConcluded', `(${package_.conc_lics})`, out)
  } else {
    write_value('PackageLicenseConcluded', package_.conc_lics, out)
  }

  // Write sorted list of licenses.
  for(let i = 0; i < package_.licenses_from_files.length; i++) {
    write_value('PackageLicenseInfoFromFiles', package_.licenses_from_files[i], out)
  }

  if(package_.has_optional_field('license_comment')) {
    write_text_value('PackageLicenseComments', package_.license_comment, out)
  }

  if(package_.cr_text instanceof six.string_types) {
    write_value('PackageCopyrightText', `(${package_.cr_text})`, out)
  } else {
    write_value('PackageCopyrightText', package_.cr_text, out)
  }

  if(package_.has_optional_field('homepage')) {
    write_value('PackageHomePage', package_.homepage, out)
  }

  for(let i = 0; i < package_.files.length; i++) {
    write_separators(out)
    write_file(package_.files[i], out)
  }
}

export const write_extracted_licenses = (lics, out) => {
  // Write extracted licenses fields to out.
  write_value('LicenseID', lics.identifier, out)
  if(lics.full_name) {
    write_value('LicenseName', lics.full_name, out)
  }

  if(lics.comment) {
    write_text_value('LicenseComment', lics.comment, out)
  }

  for(let i = 0; i < lics.cross_ref.length; i++) {
    write_value('LicenseCrossReference', lics.cross_ref[i], out)
  }

  write_text_value('ExtractedText', lics.text, out)
}

export const write_document = (document, out, validate) => {
  /*
  Write an SPDX tag value document.
    - document - spdx.document instance.
    - out - file like object that will be written to.
    Optionally `validate` the document before writing and raise
    InvalidDocumentError if document.validate returns False.
  */
    const messages = []
    messages = document.validate(messages)
    // if(validate and messages) raise InvalidDocumentError(messages)

    // Write out document information
    const data = `# Document Information \n\n`;
    fs.writeFile(out, data, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written document information");
    });
    write_value('SPDXVersion', document.version.toString(), out)
    write_value('DataLicense', document.data_license.identifier, out)
    write_value('DocumentName', document.name, out)
    write_value('SPDXID', 'SPDXRef-DOCUMENT', out)
    write_value('DocumentNamespace', document.namespace, out)
    if(document.has_comment) {
      write_text_value('DocumentComment', document.comment, out)
    }
    for(let i = 0; i < document.ext_document_references.length; i++) {
      let doc_ref = document.ext_document_references[i]
      let doc_ref_str = [doc_ref.external_document_id,
                         doc_ref.spdx_document_uri,
                         doc_ref.check_sum.identifier + ':' +
                         doc_ref.check_sum.value].join()
      write_value('ExternalDocumentRef', doc_ref_str, out)
    }
    write_separators(out)
    // Write out creation info
    write_creation_info(document.creation_info, out)
    write_separators(out)

    // Writesorted reviews
    for(let i = 0; i < document.reviews.length; i++) {
      let review = document.reviews[i]
      write_review(review, out)
      write_separators(out)
    }

    // Write sorted annotations
    for(let i = 0; i < document.annotations.length; i++) {
      let annotation = document.annotations[i]
      write_annotation(annotation, out)
      write_separators(out)
    }

    // Write out package info
    write_package(document.package, out)
    write_separators(out)

    const data2 = `# Extracted Licenses \n\n`;
    fs.writeFile(out, data2, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written extracted licenses");
    });
    for(let i = 0; i < document.extracted_licenses.length; i++) {
      let lic = document.extracted_licenses[i]
      write_extracted_licenses(lic, out)
      write_separators(out)
    }
}
