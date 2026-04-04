const { web3, contractInstance } = require('../config/blockchain');
const Joi = require('joi');

// ✅ FIXED toBytes32
const toBytes32 = (str) => {
  const hexWithout0x = web3.utils.utf8ToHex(str).slice(2);
  return '0x' + hexWithout0x.padEnd(64, '0');
};

// Validation schema for addProduct
const addProductSchema = Joi.object({
  _manufacturerID: Joi.string().required(),
  _productName: Joi.string().required(),
  _productSN: Joi.string().required(),
  _productBrand: Joi.string().required(),
  _productPrice: Joi.number().required()
});

// Product Controller

exports.addProduct = async (req, res) => {
  const { error } = addProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { _manufacturerID, _productName, _productSN, _productBrand, _productPrice } = req.body;
    const accounts = await web3.eth.getAccounts();
    await contractInstance.methods.addProduct(
      toBytes32(_manufacturerID),
      toBytes32(_productName),
      toBytes32(_productSN),
      toBytes32(_productBrand),
      _productPrice
    ).send({ from: accounts[0] });
    res.json({ success: true, message: 'Product added successfully' });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyProduct = async (req, res) => {
  try {
    const { serial } = req.params;
    const { consumerCode } = req.query;

    if (!serial || !consumerCode) {
      return res.status(400).json({ 
        error: 'Serial number and consumer code required',
        received: { serial, consumerCode }
      });
    }

    // ✅ FIXED - toBytes32 use kar raha hai ab
    const serialBytes32 = toBytes32(serial);
    const consumerCodeBytes32 = toBytes32(consumerCode);
    
    const result = await contractInstance.methods
      .verifyProduct(serialBytes32, consumerCodeBytes32)
      .call();
      
    res.json({ verified: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const history = await contractInstance.methods.getPurchaseHistory(toBytes32(consumerId)).call();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};