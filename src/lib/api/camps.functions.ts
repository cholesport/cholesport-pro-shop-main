import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { processCampInquiry } from "@/lib/camps/inquiry.server";

const campInquirySchema = z.object({
  firstName: z.string().trim().min(1, "נא למלא שם פרטי"),
  lastName: z.string().trim().min(1, "נא למלא שם משפחה"),
  email: z.string().trim().email("נא למלא כתובת אימייל תקינה"),
  phone: z.string().trim().min(9, "נא למלא מספר טלפון"),
  preferredSession: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const submitCampInquiry = createServerFn({ method: "POST" })
  .inputValidator(campInquirySchema)
  .handler(async ({ data }) => {
    return processCampInquiry({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      preferredSession: data.preferredSession,
      message: data.message,
    });
  });
