import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR:", error);
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`server is running ar port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connection failed !!!", error);
  });
