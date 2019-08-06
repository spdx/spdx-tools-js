// SPDX-License-Identifier: MIT


export class BuilderException extends Error {
  // Builder exception base class.
  constructor(...args) {
      super(...args)
      Error.captureStackTrace(this, GoodError)
  }
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
