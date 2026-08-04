import { NINJA_ART_SUMMER_CAMP } from "@/data/camps";
import { upsertCustomerLeadFromInquiry } from "@/lib/customers/leads.server";
import { notifyAdminCampInquiry, type CampInquiryPayload } from "@/lib/camps/notify.server";

const CAMP_INTEREST_LABEL = `קייטנה — ${NINJA_ART_SUMMER_CAMP.title}`;
const CAMP_INQUIRY_SOURCE = "עמוד קייטנות — אזור ילדים";

export async function processCampInquiry(data: CampInquiryPayload) {
  const { customerId, created } = await upsertCustomerLeadFromInquiry({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    inquiryType: "camp-inquiry",
    source: CAMP_INQUIRY_SOURCE,
    interestLabel: CAMP_INTEREST_LABEL,
    summary: `פנייה לקייטנה${data.preferredSession ? ` · ${data.preferredSession}` : ""}`,
    details: {
      camp: NINJA_ART_SUMMER_CAMP.title,
      preferredSession: data.preferredSession?.trim() || "לא צוין",
      message: data.message?.trim() || "—",
    },
  });

  await notifyAdminCampInquiry({ ...data, customerId, createdAccount: created });

  return { ok: true as const, customerId, createdAccount: created };
}
