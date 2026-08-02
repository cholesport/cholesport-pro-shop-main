import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertAdminRegistrationsAccess } from "@/lib/registrations/auth.server";
import { buildAdminReportsSnapshot } from "@/lib/reports/build.server";

const authTokenSchema = z.object({
  authToken: z.string().min(1),
});

export const listAdminReports = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    return buildAdminReportsSnapshot();
  });
