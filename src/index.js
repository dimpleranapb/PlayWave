import mongoose from "mongoose";
import connectDB from "./db/index.js";

connectDB();

// import express from "express";
// const app = express();

// (async () => {
//   try {
//     // Ensure you have MONGODB_URL and DB_NAME properly set in environment variables
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to the database");

//     app.on("error", (error) => {
//       console.log("Error:", error);
//       throw error;
//     });

//     const port = process.env.PORT || 3000; // Defaulting to port 3000 if not set
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("ERROR:", error);
//     throw error; // Corrected variable name
//   }
// })();
