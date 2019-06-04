export const VERSION_REGEX = /(\d+)\.(\d+)/gm;

export const version_from_string = (version) => {
  let res = version.match(VERSION_REGEX);
  if(res) {
    return [res[1], res[2]];
  } else {
    return null;
  }
}

export const version_eq = (version1, version2) => {
  if(version1 && version2) {
    return version1[0] === version2[0] && version1[1] === version2[1];
  }
  return false;
}

export const version_lt = (version1, version2) => {
  if(version1 && version2) {
    return version1[0] < version2[0] || (version1[0] === version2[0] && version1[1] < version2[1]);
  }
  return false;
}
