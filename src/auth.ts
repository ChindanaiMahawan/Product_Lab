import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

console.log("env check:", {
    secret: Boolean(process.env.AUTH_SECRET),
    id: Boolean(process.env.AUTH_GOOGLE_ID),
    googleSecret: Boolean(process.env.AUTH_GOOGLE_SECRET),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [Google],
    callbacks: {
        authorized({ auth, request }) {
            const pathname = request.nextUrl.pathname;
            const isProductManagementPage =
                /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);
            if (isProductManagementPage) {
                return Boolean(auth?.user);
            }
            return true;
        },
    },
});