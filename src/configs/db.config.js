import mongoose from "mongoose";

const connectToMongodb = () => {
  mongoose
    .connect("mongodb+srv://chisomsylvia95:September95@cluster0.eaosxk0.mongodb.net")
    .then(() => {
      console.log("Mongodb is connected!");
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error) 
    });
}

export default connectToMongodb;