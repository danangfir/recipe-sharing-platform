import mongoose from "mongoose";

const connectDb = () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    mongoose.connect(process.env.MONGODB_URI || '', {
        // Opsi koneksi yang diperbarui
    });
};

export default connectDb;
