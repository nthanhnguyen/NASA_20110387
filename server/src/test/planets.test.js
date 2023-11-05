const request = require('supertest');
const express = require('express');
const app = require('../app.js'); // Đảm bảo đường dẫn đúng

// Import các hàm từ planets.controller và planets.model (chưa được cung cấp)
const {
    httpGetAllPlanets,
} = require('../routes/planets/planet.controller.js');

const {
    getAllPlanets,
} = require('../models/planets.model.js');


const habitablePlanets = [];


// Gắn các route và middleware cần thiết
app.use(express.json());
app.use('/planets', httpGetAllPlanets);

// Hàm test GET /planets
describe('GET /planets', () => {
    it('should return all planets', async () => {
        // Thêm các planets giả lập vào danh sách habitablePlanets (từ file model)
        const fakePlanets = [
            {
                koi_disposition: 'CONFIRMED',
                koi_insol: 0.9,
                koi_prad: 1.0,
            },
            {
                koi_disposition: 'CONFIRMED',
                koi_insol: 0.5,
                koi_prad: 1.5,
            },
        ];

        fakePlanets.forEach((planet) => {
            habitablePlanets.push(planet);
        });

        const response = await request(app).get('/planets');
        expect(response.status).toBe(200);

        // So sánh kết quả trả về với danh sách habitablePlanets
        expect(response.body).toEqual(getAllPlanets());
    });
});