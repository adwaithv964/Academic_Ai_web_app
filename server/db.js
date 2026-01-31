const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.SERVER_MONGO_URI || process.env.MONGO_URI;
        const conn = await mongoose.connect(mongoURI, {
            // These options are no longer necessary in Mongoose 6+, but keeping for clarity if using older versions
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
