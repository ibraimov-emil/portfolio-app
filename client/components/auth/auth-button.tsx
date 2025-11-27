"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { UserMenu } from "./user-menu";
import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthButton() {
    const { isAuthenticated, isLoading } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const handleSwitchToRegister = () => {
        setLoginOpen(false);
        setRegisterOpen(true);
    };

    const handleSwitchToLogin = () => {
        setRegisterOpen(false);
        setLoginOpen(true);
    };

    if (isLoading) {
        return <Skeleton className="h-12 w-12 rounded-full" />;
    }

    if (isAuthenticated) {
        return <UserMenu />;
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setLoginOpen(true)}
                className="h-12 w-12"
            >
                <LogIn className="h-5 w-5" />
            </Button>

            <LoginDialog
                open={loginOpen}
                onOpenChange={setLoginOpen}
                onSwitchToRegister={handleSwitchToRegister}
            />

            <RegisterDialog
                open={registerOpen}
                onOpenChange={setRegisterOpen}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
}