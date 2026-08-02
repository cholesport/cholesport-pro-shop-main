import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ADMIN_ACCOUNT_PROFILE } from "@/data/account";
import {
  createAdminAuthToken,
  isAdminAccountEmail,
  verifyAdminAccountCredentials,
} from "@/lib/auth/admin.server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginAccount = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    if (!isAdminAccountEmail(data.email)) {
      return { isAdmin: false as const };
    }

    if (!verifyAdminAccountCredentials(data.email, data.password)) {
      throw new Error("אימייל או סיסמה שגויים.");
    }

    const authToken = createAdminAuthToken(data.email);
    return {
      isAdmin: true as const,
      authToken,
      profile: {
        ...ADMIN_ACCOUNT_PROFILE,
        email: data.email.trim(),
        isAdmin: true,
      },
    };
  });
