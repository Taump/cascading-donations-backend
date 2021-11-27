const store = require('../store.js');

module.exports = async () => {
  const data = store.get();

  return { data }
}