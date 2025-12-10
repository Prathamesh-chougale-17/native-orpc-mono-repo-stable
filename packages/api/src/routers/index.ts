import {
  protectedProcedure,
  publicProcedure,
  adminProcedure,
  roleProcedure,
} from "../index";
import type { RouterClient } from "@orpc/server";

export const appRouter = {
  // Existing endpoints
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  adminOnlyData: adminProcedure.handler(({ context }) => {
    return {
      message: "This is admin only data",
      user: context.session?.user,
      adminInfo: "Only admins can see this",
    };
  }),
  userRoleData: roleProcedure(["user", "admin"]).handler(({ context }) => {
    return {
      message: "This is accessible to users and admins",
      user: context.session?.user,
    };
  }),
  
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
