const { connect, connection } = require('mongoose');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('process.env.MONGO_URL', () => {
    console.log('Connected to MongoDB');
});

const connectionString =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialapiDB';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;