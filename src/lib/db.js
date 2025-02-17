import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongo db connected successfully ${connect.connection.host}`);
    } catch (err) {
        console.log(`Mongo db connected error ${err}`);

    }
}