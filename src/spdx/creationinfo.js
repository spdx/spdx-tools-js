// SPDX-License-Identifier: MIT

import {LICENSE_LIST_VERSION} from './config';
import {datetime_iso_format} from './utils';
import moment from 'moment';

export class Creator {
  /*
  Creator enity.
    Fields:
    - name: creator's name/identifier
  */
  constructor(name) {
    this.name = name;
  }

  __eq__(other) {
    return other instanceof Creator && this.name === other.name;
  }

  __lt__(other) {
    return other instanceof Creator && this.name < other.name;
  }
}

export class Organization extends Creator {
  /*
  Organization entity.
    Fields:
    - name: Org's name/identifier. Mandatory. Type: str.
    - email: Org's email address. Optional. Type: str.
  */
  constructor(name, email) {
    super(name);
    this.email = email;
  }

  __eq__(other) {
    return other instanceof Organization && this.name === other.name && this.email === other.email;
  }

  __lt__(other) {
    return other instanceof Organization && this.name < other.name && this.email < other.email;
  }

  to_value() {
    if(this.email) {
      return `Organization: ${this.name} (${this.email})`;
    }
    return `Organization: ${this.name}`;
  }

  toString() {
    return this.to_value();
  }

}

export class Person extends Creator {
  /*
  Person entity.
    Fields:
    - name: person's name/identifier. Mandatory. Type: str.
    - email: person's email address. Optional. Type: str.
  */
  constructor(name, email) {
    super(name);
    this.email = email;
  }

  __eq__(other) {
    return other instanceof Person && this.name === other.name && this.email === other.email;
  }

  __lt__(other) {
    return other instanceof Person && this.name < other.name && this.email < other.email;
  }

  to_value() {
    if(this.email) {
      return `Person: ${this.name} (${this.email})`;
    }
    return `Person: ${this.name}`;
  }

  toString() {
    return this.to_value();
  }

}

export class Tool extends Creator {
  /*
  Tool entity.
    Fields:
    - name: tool identifier, with version. Type: str.
  */
  constructor(name) {
    super(name);
  }

  to_value() {
    return `Tool: ${this.name}`;
  }

  toString() {
    return this.to_value();
  }

}

export class CreationInfo extends Creator {
  /*
  Represent a document creation info.
    Fields:
    - creators: List of creators. At least one required.
        Type: Creator.
    - comment: Creation comment, optional. Type: str.
    - license_list_version: version of SPDX license used in creation of SPDX
        document. One, optional. Type: spdx.version.Version
    - created: Creation date. Mandatory one. Type: datetime.
  */
  constructor(created, comment, license_list_version) {
    super();
    this.creators = [];
    this.created = created;
    this.comment = comment;
    this.license_list_version = license_list_version ? license_list_version : LICENSE_LIST_VERSION
  }

  add_creator(creator) {
    this.creators.push(creator);
  }

  remove_creator(creator) {
    const index = this.creators.indexOf(creator);
    if (index !== -1) this.creators.splice(index, 1);
  }

  set_created_now() {
    return moment.utc().format();;
  }

  created_iso_format() {
    return datetime_iso_format(this.created);
  }

  has_comment() {
    return this.comment ? true : false;
  }

  validate(messages) {
    messages = this.validate_creators(messages);
    messages = this.validate_created(messages);
    return messages;
  }

  validate_creators(messages) {
    if(this.creators.length === 0) {
      messages = `${messages} ['No creators defined, must have at least one.']`;
    }
    return messages;
  }

  validate_created(messages) {
    if(!this.created) {
      messages = `${messages} ['Creation info missing created date.']`;
    }
    return messages;
  }

}

module.exports = {
  Creator : Creator,
  Organization : Organization,
  Person : Person,
  Tool : Tool,
  CreationInfo : CreationInfo,
}
