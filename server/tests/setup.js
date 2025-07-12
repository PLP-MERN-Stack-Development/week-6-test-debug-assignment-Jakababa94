const mongoose = require ('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeEach(async () => {
  await User.deleteMany({});
});

beforeAll(async ()=> {
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();
    await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async ()=> {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        await collections[key].deleteMany({});
    }
});