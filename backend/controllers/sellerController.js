const { web3, contractInstance } = require('../config/blockchain');

const toBytes32 = (str) => {
  const hexWithout0x = web3.utils.utf8ToHex(str).slice(2);
  return '0x' + hexWithout0x.padEnd(64, '0');
};

// Add Seller
exports.addSeller = async (req, res) => {
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
    res.json({ success: true, message: 'Seller added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ FIXED - bytes32 conversion add kiya
exports.sellProduct = async (req, res) => {
  try {
    const { _productSN, _consumerCode } = req.body;
    const accounts = await web3.eth.getAccounts();
    const tx = await contractInstance.methods.sellerSellProduct(
      toBytes32(_productSN),
      toBytes32(_consumerCode)
    ).send({ from: accounts[0] });

    // ✅ TX hash return karo
    res.json({ success: true, message: 'Product sold by seller', txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.querySellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await contractInstance.methods
      .queryProductsList(toBytes32(sellerId)).call();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};