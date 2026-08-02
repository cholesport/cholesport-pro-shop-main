import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCustomerFromSessionToken } from "@/lib/customers/helpers.server";
import {
  getCustomerCommerceHistoryForAccount,
  getUnifiedCustomerDetail,
  listUnifiedCustomersForAdmin,
} from "@/lib/commerce/unified.server";
import { assertAdminRegistrationsAccess } from "@/lib/registrations/auth.server";

const authTokenSchema = z.object({
  authToken: z.string().min(1),
});

const customerTokenSchema = z.object({
  customerToken: z.string().min(1),
});

const customerKeySchema = authTokenSchema.extend({
  customerKey: z.string().min(1),
  domain: z.enum(["shop", "activities"]).optional(),
});

export const getCustomerCommerceHistory = createServerFn({ method: "POST" })
  .inputValidator(customerTokenSchema)
  .handler(async ({ data }) => {
    const { customer } = await getCustomerFromSessionToken(data.customerToken);
    const history = await getCustomerCommerceHistoryForAccount(customer);
    return { history };
  });

export const listUnifiedCustomers = createServerFn({ method: "POST" })
  .inputValidator(authTokenSchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    return listUnifiedCustomersForAdmin();
  });

export const getUnifiedCustomer = createServerFn({ method: "POST" })
  .inputValidator(customerKeySchema)
  .handler(async ({ data }) => {
    assertAdminRegistrationsAccess(data.authToken);
    return getUnifiedCustomerDetail(data.customerKey, data.domain);
  });
