import request from 'supertest';
import { expect } from 'chai'; // Use import for 'expect'
import { app } from '../backend/index.js'; // Use import for 'app'

describe('Integration Test: Frontend-Backend Interaction', () => {
  it('should get books from the backend', async () => {
    const response = await request(app).get('/books');
    expect(response.status).to.equal(200);
   
  });


});

  