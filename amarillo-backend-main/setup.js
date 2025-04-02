import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret';
    process.env.NODE_ENV = 'test';

});

afterAll(async () => {
    await mongoose.disconnect();
    
});