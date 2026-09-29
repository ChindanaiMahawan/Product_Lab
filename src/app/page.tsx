import { auth } from "@/auth";
import { AuthButtons } from "@/components/auth-button";
import ProductExplorer from "@/components/ProductExplorer";

export default async function HomePage() {
    const session = await auth();
    const isLoggedIn = Boolean(session?.user);

    return (
        <ProductExplorer
            isLoggedIn={isLoggedIn}
            authButtons={
                <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
            }
        />
    );
}