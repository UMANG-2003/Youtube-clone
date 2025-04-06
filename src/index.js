import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  } );
}).catch((error) => {
  console.error("Database connection error:", error);
  process.exit(1); // Exit the process with failure
}
);
