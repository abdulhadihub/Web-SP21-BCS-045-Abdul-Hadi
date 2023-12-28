const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected you are good to GO!')
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDb