import mongoose from "mongoose";

const connectToMongodb = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Mongodb is connected!");
    })
    .catch(() => {
      console.log("Error detected");
    });
}

export default connectToMongodb;