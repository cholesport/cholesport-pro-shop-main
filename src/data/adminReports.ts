import type { ActivityRegistrationStatus } from "@/data/registrations";
import type { ActivityPassStatus } from "@/data/passes";

export type ActiveSubscriptionReportRow = {
  id: string;
  participantName: string;
  phone: string;
  email?: string;
  planId: string;
  planName: string;
  categoryName: string;
  status: ActivityRegistrationStatus;
  updatedAt: string;
  hasAccount: boolean;
};

export type ActivePassReportRow = {
  id: string;
  participantName: string;
  phone: string;
  email?: string;
  planId: string;
  planName: string;
  categoryName: string;
  entriesRemaining: number;
  entriesTotal: number;
  status: ActivityPassStatus;
  purchasedAt: string;
  updatedAt: string;
  hasAccount: boolean;
};

export type AdminReportsSnapshot = {
  activeSubscriptions: ActiveSubscriptionReportRow[];
  activePasses: ActivePassReportRow[];
  updatedAt: string;
};
