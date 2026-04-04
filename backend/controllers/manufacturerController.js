const { web3, contractInstance } = require('../config/blockchain');

// ✅ Correct bytes32 conversion
const toBytes32 = (str) => {
  const hexWithout0x = web3.utils.utf8ToHex(str).slice(2);
  return '0x' + hexWithout0x.padEnd(64, '0');
};

// Manufacturer Controller

exports.registerManufacturer = async (req, res) => {
  try {
    const { _manufacturerId, _sellerName, _sellerBrand, _sellerCode, _sellerNum, _sellerManager, _sellerAddress } = req.body;
    const accounts = await web3.eth.getAccounts();
    await contractInstance.methods.addSeller(
      toBytes32(_manufacturerId),
      toBytes32(_sellerName),
      toBytes32(_sellerBrand),
      toBytes32(_sellerCode),
      _sellerNum,
      toBytes32(_sellerManager),
      toBytes32(_sellerAddress)
    ).send({ from: accounts[0] });
    res.json({ success: true, message: 'Seller registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.transferToSeller = async (req, res) => {
  try {
    const { _productSN, _sellerCode } = req.body;
    const accounts = await web3.eth.getAccounts();
    const tx = await contractInstance.methods.manufacturerSellProduct(
      toBytes32(_productSN),
      toBytes32(_sellerCode)
    ).send({ from: accounts[0] });

    // ✅ TX hash return karo
    res.json({ success: true, message: 'Product transferred to seller', txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};