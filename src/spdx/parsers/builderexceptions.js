// SPDX-License-Identifier: MIT


export class BuilderException {
}

export class CardinalityError extends BuilderException {

  constructor(msg) {
    super();
    this.msg = msg;
  }

}

export class SPDXValueError extends BuilderException {

  constructor(msg) {
    super();
    this.msg = msg;
  }

}

export class OrderError extends BuilderException {

  constructor(msg) {
    super();
    this.msg = msg;
  }

}
