import dotenv from "dotenv";

dotenv.config({ quiet: true });

interface Config {
  PORT: string;
  NODE_ENV: string;
  APP_URL: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRATION: string;
  REFRESH_TOKEN_EXPIRATION: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRATION: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
}

const loadEnvVariables = (): Config => {
  const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "APP_URL",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRATION",
    "REFRESH_TOKEN_EXPIRATION",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRATION",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required but not defined.`,
      );
    }
  });
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    APP_URL: process.env.APP_URL as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION as string,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRATION: process.env
      .BETTER_AUTH_SESSION_TOKEN_EXPIRATION as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env
      .BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
  };
};

export const envVars = loadEnvVariables();
