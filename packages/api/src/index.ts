import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

const requireAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const userRole = (context.session.user as any).role;
  const isAdmin =
    userRole === "admin" ||
    (typeof userRole === "string" && userRole.split(",").includes("admin"));

  if (!isAdmin) {
    throw new ORPCError("FORBIDDEN", {
      message: "Admin access required",
    });
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

export const adminProcedure = publicProcedure.use(requireAdmin);

const requireRole = (allowedRoles: string[]) => {
  return o.middleware(async ({ context, next }) => {
    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const userRole = (context.session.user as any).role;
    const userRoles =
      typeof userRole === "string" ? userRole.split(",") : [userRole];

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      throw new ORPCError("FORBIDDEN", {
        message: `Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    return next({
      context: {
        session: context.session,
      },
    });
  });
};

export const roleProcedure = (allowedRoles: string[]) =>
  publicProcedure.use(requireRole(allowedRoles));
