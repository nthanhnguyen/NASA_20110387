const request = require('supertest');
const express = require('express');
const app = require('../app.js');

// Import các hàm từ launches.controller và launches.model
const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
} = require('../routes/launches/launches.controller.js');

const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../models/launches.model.js');

// Gắn các route và middleware cần thiết
app.use(express.json());
app.use('/launches', httpGetAllLaunches);
app.use('/launches', httpAddNewLaunch);
app.use('/launches', httpAbortLaunch);

//Hàm test GET / launches
describe('GET /launches', () => {
    it('should return all launches', async () => {
        // Thêm các launches giả lập vào launches.map
        addNewLaunch({
            flightNumber: 101,
            mission: 'Test Mission',
            rocket: 'Test Rocket',
            launchDate: new Date('December 27, 2030'),
            target: 'Kepler-442 b',
            customer: ['ZTM', 'NASA'],
            upcoming: true,
            success: true,
        });

        const response = await request(app).get('/launches');
        expect(response.status).toBe(200);

        // Chuyển đổi launchDate thành chuỗi trước khi so sánh
        const allLaunches = getAllLaunches().map((launch) => {
            return {
                ...launch,
                launchDate: launch.launchDate.toISOString(),
            };
        });

        expect(response.body).toEqual(allLaunches);
    });
});


//Hàm test POST /launches
describe('POST /launches', () => {
    it('should add a new launch', async () => {
        const newLaunch = {
            mission: 'New Mission',
            rocket: 'New Rocket',
            launchDate: new Date('December 29, 2030'),
            target: 'Kepler-442 b',
            customer: ['ZTM', 'NASA'],
        };

        const response = await request(app)
            .post('/launches')
            .send(newLaunch);

        expect(response.status).toBe(201);
        expect(existsLaunchWithId(response.body.flightNumber)).toBe(true);
    });
});

// Hàm test DELETE /launches/:id
describe('DELETE /launches/:id', () => {
    it('should abort a launch', async () => {
        // Thêm một launch giả lập
        addNewLaunch({
            flightNumber: 102,
            mission: 'Test Mission',
            rocket: 'Test Rocket',
            launchDate: new Date('December 30, 2030'),
            target: 'Kepler-442 b',
            customer: ['ZTM', 'NASA'],
            upcoming: true,
            success: true,
        });

        const response = await request(app).delete('/launches/102');
        expect(response.status).toBe(200);
        expect(abortLaunchById(102).upcoming).toBe(false);
        expect(abortLaunchById(102).success).toBe(false);
    });
});