import { signIn, signOut } from "@/auth";

type AuthButtonsProps = {
    isLoggedIn: boolean;
    userName?: string | null;
};

const outlineButton =
    "rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50";

const primaryButton =
    "rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800";

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600">
                    สวัสดี {userName ?? "ผู้ใช้งาน"}
                </span>
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                    }}
                >
                    <button type="submit" className={outlineButton}>
                        Logout
                    </button>
                </form>
            </div>
        );
    }

    return (
        <form
            action={async () => {
                "use server";
                // ชื่อ provider ของ Google (ตัวพิมพ์เล็ก)
                await signIn("google", { redirectTo: "/" });
            }}
        >
            <button type="submit" className={primaryButton}>
                Login with Google
            </button>
        </form>
    );
}