// SPDX-License-Identifier: MIT

export const VERSION_REGEX = /(\d+)\.(\d+)/gm;

export default class Algorithm {
  /*
  Version number composed of major and minor.
    Fields:
    - major: Major number, int.
    - minor: Minor number, int.
  */
  constructor(major, minor) {
    this.major = major;
    this.minor = minor;
  }

  from_str(value) {
    /*
    Constructs a Version from a string.
        Returns None if string not in N.N form where N represents a
        number.
    */
    let res = value.match(VERSION_REGEX);
    if(res) {
      return [res[1], res[2]];
    } else {
      return null;
    }
  }

  to_str() {
    return `SPDX-${this.major}.${this.minor}`;
  }

  __eq__(other) {
    return this.major === other.major && this.minor === other.minor;
  }

  __lt__(other) {
    return this.major < other.major || (this.major === other.major && this.minor < other.minor);
  }
}
