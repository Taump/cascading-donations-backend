const DAG = require('aabot/dag.js');
const conf = require('ocore/conf.js');

exports.getRules = async (fullName) => {
  try {
    let rules = await DAG.readAAStateVars(conf.aa_address, `${fullName}*rules`).then(vars => vars[`${fullName}*rules`]) || {};

    if (Object.keys(rules).length > 0) {
      const sum = Object.values(rules).reduce((prev, current) => {
        return prev + current;
      }, 0);

      if (sum === 100) {
        return rules
      } else {
        return Object.assign(rules, { [fullName]: 100 - sum })
      }
      
    } else {
      return { [fullName]: 100 }
    }

  } catch (e) {
    console.error(e);
    return ({})
  }
}