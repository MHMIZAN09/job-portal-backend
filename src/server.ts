import app from "./app";
import { envVars } from "./app/config";
const port = envVars.PORT;

const main = async () => {
  try {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

main();
