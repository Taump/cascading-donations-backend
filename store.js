function Store() {
  this.data = [];

  this.update = (data) => {
    this.data = data;
  }

  this.get = () => {
    return this.data;
  }
}

module.exports = new Store;