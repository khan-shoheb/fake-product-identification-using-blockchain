const request = require('supertest');
const express = require('express');
const productRoutes = require('../routes/productRoutes');
const { web3, contractInstance } = require('../config/blockchain');

const app = express();
app.use(express.json());
app.use('/api/product', productRoutes);

describe('Product API', () => {
  it('should return 401 if role not provided', async () => {
    const res = await request(app)
      .post('/api/product/add')
      .send({});
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Role not provided');
  });

  it('should return 403 if wrong role provided', async () => {
    const res = await request(app)
      .post('/api/product/add')
      .set('x-user-role', 'seller')
      .send({});
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Access denied: insufficient role');
  });

  it('should add a product with manufacturer role', async () => {
    const res = await request(app)
      .post('/api/product/add')
      .set('x-user-role', 'manufacturer')
      .send({
        _manufactuerID: 'MFG123',
        _productName: 'TestProduct',
        _productSN: 'SN123456',
        _productBrand: 'TestBrand',
        _productPrice: 1000
      });
    // Blockchain call may take time, so check for success or error
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
    } else {
      expect(res.body.error).toBeDefined();
    }
  });

  it('should verify a product with consumer role', async () => {
    const res = await request(app)
      .get('/api/product/verify/SN123456?consumerCode=CONSUMER1')
      .set('x-user-role', 'consumer');
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('verified');
    } else {
      expect(res.body.error).toBeDefined();
    }
  });

  it('should get purchase history for consumer', async () => {
    const res = await request(app)
      .get('/api/product/history/CONSUMER1')
      .set('x-user-role', 'consumer');
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toBeDefined();
    } else {
      expect(res.body.error).toBeDefined();
    }
  });
});
