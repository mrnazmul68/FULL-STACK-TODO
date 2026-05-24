import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server error", error.message);
    process.exit(1);
  }
};

startServer();
