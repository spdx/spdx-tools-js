import moment from 'moment';
import {datetime_iso_format} from '../utils/general';


export default class Annotation {
  /*
  Document annotation information.
    Fields:
    - annotator: Person, Organization or tool that has commented on a file,
    package, or the entire document. Conditional (Mandatory, one), if there
    is an Annotation.
    - annotation_date: To identify when the comment was made. Conditional
    (Mandatory, one), if there is an Annotation. Type: datetime.
    - comment: Annotation comment. Conditional (Mandatory, one), if there is
    an Annotation. Type: str.
    - annotation_type: Annotation type. Conditional (Mandatory, one), if there is an
    Annotation. Type: str.
    - spdx_id: Uniquely identify the element in an SPDX document which is being
    referenced. Conditional (Mandatory, one), if there is an Annotation.
    Type: str.
  */
  constructor(identifier, value) {
    this.annotator = annotator;
    this.annotation_date = annotation_date;
    this.comment = comment;
    this.annotation_type = annotation_type;
    this.spdx_id = spdx_id;
  }

  __eq__(other) {
    return other instanceof Annotation && this.annotator === other.annotator && this.annotation_date === other.annotation_date && this.comment === other.comment;
  }

  __lt__(other) {
    return this.annotator < other.annotator && this.annotation_date < other.annotation_date && this.comment < other.comment;
  }

  set_annotation_date_now() {
    this.annotation_date = moment.utc().format();
  }

  annotation_date_iso_format() {
    return datetime_iso_format(this.annotation_date);
  }

  has_comment() {
    return this.comment;
  }

  validate(messages) {
    /*
    Returns True if all the fields are valid.
    Appends any error messages to messages parameter.
    */
    messages = this.validate_annotator(messages)
    messages = this.validate_annotation_date(messages)
    messages = this.validate_annotation_type(messages)
    messages = this.validate_spdx_id(messages)

    return messages;
  }

  validate_annotator(messages) {
    if(!this.annotator) {
      messages = `${messages} ['Annotation missing annotator.']`;
    }
    return messages;
  }

  validate_annotation_date(messages) {
    if(!this.annotation_date) {
      messages = `${messages} ['Annotation missing annotation date.']`;
    }
    return messages;
  }

  validate_annotation_type(messages) {
    if(!this.annotation_type) {
      messages = `${messages} ['Annotation missing annotation type.']`;
    }
    return messages;
  }

  validate_spdx_id(messages) {
    if(this.spdx_id) {
      messages = `${messages} ['Annotation missing SPDX Identifier Reference.']`;
    }
    return messages;
  }
}
