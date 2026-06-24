import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role } from "../../generated/prisma/enums";
// import { envVars } from "../config";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.JOB_SEEKER,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
      },
    },
  },

  // trustedOrigins: [envVars.APP_URL || "http://localhost:5000"],
  // advanced: {
  //   disableCSRFCheck: true,
  // },
});
