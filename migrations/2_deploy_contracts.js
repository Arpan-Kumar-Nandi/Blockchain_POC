const POC20 = artifacts.require("POC20.sol");
const { Contract } = require('../recordDeployment')

module.exports = async function (deployer) {
  await deployer.deploy(POC20);
  const poc20Instance = await POC20.deployed()
  console.log(poc20Instance.constructor['_json'].contractName, poc20Instance.address)
  
  await Contract.create({ name: poc20Instance.constructor['_json'].contractName, address: poc20Instance.address})
}
