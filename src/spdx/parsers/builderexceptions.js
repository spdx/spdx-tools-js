// SPDX-License-Identifier: MIT


export class BuilderException {
  return;
}

export class CardinalityError extends BuilderException {

  constructor(msg) {
    this.msg = msg;
  }

}

export class SPDXValueError extends BuilderException {

  constructor(msg) {
    this.msg = msg;
  }

}

export class OrderError extends BuilderException {

  constructor(msg) {
    this.msg = msg;
  }

}
