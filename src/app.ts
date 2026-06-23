import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { envVars } from "./app/config";
import { auth } from "./app/lib/auth";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { logger } from "./app/middlewares/logger";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(logger);
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: envVars.APP_URL,
    credentials: true, // Allow cookies to be sent with requests
  }),
);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Job Portal API!");
});

// notFound and globalErrorHandler will be added in src/server.ts to avoid circular dependencies
app.use(notFound);
app.use(globalErrorHandler);

export default app;
