import mongoose from "mongoose";

const connectToMongodb = () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined.");
    return;
  }
  const uri = `${process.env.MONGODB_URI}/doctermy`;
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Mongodb is connected!");
    })
    .catch((error) => {
      console.log("Error detected", error);
    });
};

export default connectToMongodb;
