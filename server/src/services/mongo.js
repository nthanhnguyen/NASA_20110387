const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://nguyen3:123456Aa@nasacluster.nghwuu7.mongodb.net/'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection succeed!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisConnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisConnect
}