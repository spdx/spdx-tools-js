// SPDX-License-Identifier: MIT

import Version from './version';

const fs = require('fs');
const path = require('path');

export default class Algorithm {
  // Generic checksum algorithm.
  constructor(identifier, value) {
    this.identifier = identifier;
    this.value = value;
  }

  to_tv() {
    return `${this.identifier}: ${this.value}`;
  }
}


const load_license_list = (file_name) => {
  /*
  Return the licenses list version tuple and a mapping of licenses
    name->id and id->name loaded from a JSON file
    from https://github.com/spdx/license-list-data
  */

  let licenses_map = {}
  let lics = fs.readFileSync(file_name, 'utf8');
  let licenses = JSON.parse(lics)
  let version = licenses['licenseListVersion'].split('.')
  for(let i = 0; i < licenses['licenses'].length; i++) {
    let lic = licenses['licenses'][i]
    if(lic['isDeprecatedLicenseId']) continue;
    let name = lic['name']
    let identifier = lic['licenseId']
    licenses_map[name] = identifier
    licenses_map[identifier] = name
  }
  return {
    "major": version[0],
    "minor": version[1],
    "license_map": licenses_map
  }
}

// get_licenses = () => {
//
// }

const _base_dir = __dirname
const _licenses = path.join(_base_dir, 'licenses.json')
const _exceptions = path.join(_base_dir, 'exceptions.json')
const license_list = load_license_list(_licenses)

export const _major = license_list["major"]
export const _minor = license_list["minor"]
export const LICENSE_MAP = license_list["license_map"]
export const LICENSE_LIST_VERSION = new Version(_major, _minor)
