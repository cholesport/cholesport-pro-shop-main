/** Server-persisted customer account (not exposed to client bundle directly). */
export type CustomerAccountType = "registered" | "lead";

export type CustomerInquiryRecord = {
  id: string;
  type: string;
  source: string;
  summary: string;
  details?: Record<string, string>;
  createdAt: string;
};

export type CustomerRecord = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarDataUrl?: string;
  registeredAt: string;
  updatedAt: string;
  accountType?: CustomerAccountType;
  interests?: string[];
  inquiries?: CustomerInquiryRecord[];
};

export type CustomersStore = {
  customers: CustomerRecord[];
  updatedAt: string;
};

/** Max decoded avatar payload (~400 KB). */
export const CUSTOMER_AVATAR_MAX_BYTES = 400_000;
