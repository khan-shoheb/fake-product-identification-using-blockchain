const express = require('express');
const cors = require('cors');
const Web3 = require('web3').Web3;
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Update this with your local or testnet node
const web3 = new Web3('http://127.0.0.1:8545'); // Ganache running on 8545

// Example: Load contract ABI and address
const contractAddress = '0x77d8A7c88572419b20468675320dF7CaDf46a5BD';
const contractABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "productItems",
    "outputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "internalType": "bytes32", "name": "productSN", "type": "bytes32" },
      { "internalType": "bytes32", "name": "productName", "type": "bytes32" },
      { "internalType": "bytes32", "name": "productBrand", "type": "bytes32" },
      { "internalType": "uint256", "name": "productPrice", "type": "uint256" },
      { "internalType": "bytes32", "name": "productStatus", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "name": "productMap",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "name": "productsForSale",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "name": "productsManufactured",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "name": "productsSold",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "productsWithConsumer",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "productsWithSeller",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "sellers",
    "outputs": [
      { "internalType": "uint256", "name": "sellerId", "type": "uint256" },
      { "internalType": "bytes32", "name": "sellerName", "type": "bytes32" },
      { "internalType": "bytes32", "name": "sellerBrand", "type": "bytes32" },
      { "internalType": "bytes32", "name": "sellerCode", "type": "bytes32" },
      { "internalType": "uint256", "name": "sellerNum", "type": "uint256" },
      { "internalType": "bytes32", "name": "sellerManager", "type": "bytes32" },
      { "internalType": "bytes32", "name": "sellerAddress", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  // ... (rest of ABI omitted for brevity)
];
const productContract = new web3.eth.Contract(contractABI, contractAddress);

// Middleware to inject web3 and contract into req
app.use((req, res, next) => {
  req.web3 = web3;
  req.contract = productContract;
  next();
});

const productRoutes = require('./routes/productRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');

app.use('/api/product', productRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/manufacturer', manufacturerRoutes);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fake Product API',
      version: '1.0.0',
      description: 'API documentation for Fake Product Identification using Blockchain',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/', (req, res) => {
  res.send('Fake Product Backend is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
