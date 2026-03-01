import { auth } from "@/lib/auth.ts";
import type { ErrorResponseType } from "@/types/error.types.ts";
import { createMiddleware } from "hono/factory";
import { findUserPermissions } from "@/db/respository/permissions.repository.ts";
import type { PinoLogger } from "hono-pino";

export const requireAuth = createMiddleware(async (c, next) => {
	const userSession = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!userSession) {
		const response: ErrorResponseType = {
			code: "AUTH_REQUIRED",
			message: "Unauthorised. Please login to continue with this request",
		};

		return c.json(response, 401);
	}

	const { user, session } = userSession;

	c.set("user", user);
	c.set("session", session);
	c.set("userId", user.id);

	await next();
});

export const verifyPermissions = (options: {
	permissions: string | string[];
	requireAll?: boolean;
}) => {
	return createMiddleware<{
		Variables: { userId: string; logger: PinoLogger; userPermissions: unknown };
	}>(async (c, next) => {
		const userId = c.get("userId");
		const logger = c.get("logger");

		const userPermissions = await findUserPermissions(userId);
		const permissionNames = userPermissions.map((row) => row.name);

		const requiredPermissions = Array.isArray(options.permissions)
			? options.permissions
			: [options.permissions];

		const hasPermission = options.requireAll
			? requiredPermissions.every((perm) => permissionNames.includes(perm))
			: requiredPermissions.some((perm) => permissionNames.includes(perm));

		if (!hasPermission) {
			logger.warn(
				{ requiredPermissions, userPermissions },
				"User attempted to perform an operation outside of his scope",
			);
			const response: ErrorResponseType = {
				code: "PERMISSION_DENIED",
				message: "You are not allowed to perform this action",
			};

			return c.json(response, 403);
		}

		c.set("userPermissions", requiredPermissions);

		await next();
	});
};
