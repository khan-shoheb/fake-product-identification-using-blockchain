let Web3 = require('web3');
if (Web3.default) Web3 = Web3.default;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Ganache ya Infura ka URL yahan set karein
envProvider = process.env.BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:8545';
const web3 = new Web3(envProvider);

// Contract ABI aur address load karo
const abiPath = path.join(__dirname, '../../build/contracts/product.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
const contractAddress = process.env.CONTRACT_ADDRESS || '0x1307b27CD06379d188eBEF26C09B482346b0fA39'; // <-- update to new address

const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

module.exports = {
  web3,
  contractInstance
};
