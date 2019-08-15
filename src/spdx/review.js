// SPDX-License-Identifier: MIT

import {LICENSE_MAP} from './config';
import NoAssert from './utils';
import SPDXNone from './utils';
import {max, datetime_iso_format} from './utils';
import License from './document';
import Creator from './creationinfo';

const hash = require('object-hash');

export default class Review {
  /*
  Document review information.
    Fields:
    - reviewer: Person, Organization or tool that reviewed the SPDX file.
      Mandatory one.
    - review_date: Review date, mandatory one. Type: datetime.
    - comment: Review comment. Optional one. Type: str.
  */
  constructor(reviewer, review_date, comment) {
    this.reviewer = reviewer;
    this.review_date = review_date;
    this.comment = comment;
  }

  __eq__(other) {
    return other instanceof Review && this.reviewer === other.reviewer && this.review_date === other.review_date && this.coment === other.comment;
  }

  __lt__(other) {
    return this.reviewer < other.reviewer && this.review_date < other.review_date && this.coment < other.comment;
  }

  set_review_date_now() {
    this.review_date = moment();
  }

  review_date_iso_format() {
    return datetime_iso_format(this.review_date);
  }

  has_comment() {
    return this.comment ? true : false;
  }


  validate(messages) {
    /*
    Returns True if all the fields are valid.
        Appends any error messages to messages parameter.
    */
    messages = this.validate_reviewer(messages);
    messages = this.validate_review_date(messages);
    return messages;
  }

  validate_reviewer(messages) {
    if(!this.reviewer) {
      messages = `${messages} [Review missing reviewer.]`;
    }
    return messages;
  }

  validate_review_date(messages) {
    if(!this.review_date) {
      messages = `${messages} [Review missing review date.]`;
    }
    return messages;
  }
}
