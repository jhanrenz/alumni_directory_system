import type { ReactNode } from "react";
import UserHeader from "./UserHeader";
import { useAuth } from "../hooks/auth/useAuth";

interface UserLayoutProps{
    children : ReactNode;
}

const UserLayout = ({ children} : UserLayoutProps) => {
    const { user, isAdmin } = useAuth();

    return(
        <>
            {user && !isAdmin && <UserHeader/>}
            <main className="pt-[80px] sm:pt-[90px]">
            {children}
            </main>
        </>
    )
}
export default UserLayout;