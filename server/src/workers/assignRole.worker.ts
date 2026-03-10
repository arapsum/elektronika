import { assignUserARole, fetchRoleByName } from "@/repository/roles.repository.ts";

export const assignCustomerRoleWorker = (userId: string) => {
  queueMicrotask(async () => {
    const customerRole = await fetchRoleByName("customer");

    const assigned = await assignUserARole({ userId, roleId: customerRole.id });

    console.log(
      `User ${assigned[0].userId} assigned role ${assigned[0].roleId} at ${assigned[0].assignedAt}`,
    );
  });
};
