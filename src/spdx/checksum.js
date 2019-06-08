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
