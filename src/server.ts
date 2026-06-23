import app from "./app";
const port = 3000; // The port your express server will be running on.

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
