// SPDX-License-Identifier: MIT


export class StandardLogger {

  log(msg) {
    console.log(msg);
  }

}

export class FileLogger {

  constructor(logfile) {
    this.dest = logfile;
  }

  log(msg) {
    this.dest.write(`${msg} \n`);
  }

}
