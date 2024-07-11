const initMongoDB = require('./db/initMongoDB');
const startServer = require('./server');

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};
bootstrap();
