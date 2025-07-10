const mongoose = require ('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async ()=> {
    mongoSever = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();
    await mongoose.connect(mongoURI);
});

afterAll(async ()=> {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async ()=> {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        await collections[key].deleteMany({});
    }
});