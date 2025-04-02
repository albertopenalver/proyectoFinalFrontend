// tests/userRoutes.test.js
import { main } from '../../app'; // Asegúrate de que esta es la ruta correcta
import mongoose from 'mongoose';

beforeAll(async () => {
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Sample Test', () => {
    it('should always pass', () => {
        expect(true).toBe(true);
    });
});