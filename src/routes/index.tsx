import * as React from "react";

// Third Party
import {createFileRoute, useNavigate} from '@tanstack/react-router'

// UI
import {Button} from '@/components/ui/button'
import {Input} from "@/components/ui/input.tsx";
import {AUTH_KEY} from "@/constants";

// Constants

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const navigate = useNavigate();


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const formData = new FormData(e.currentTarget);

        const email = formData.get('email');
        const password = formData.get('password');

        const payload = {
            email, password
        }

        console.log("Submit Value", payload);

        localStorage.setItem(AUTH_KEY, JSON.stringify(payload));

        navigate({
            to: "/dashboard",
            replace: true,
        })

    }


    return (
        <section className="bg-muted h-screen">
            <form onSubmit={handleSubmit} className="flex h-full items-center justify-center">
                {/* Logo */}
                <div className="flex flex-col items-center gap-6 lg:justify-start">

                    <div
                        className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
                        <h1 className="text-xl font-semibold">CRM System</h1>
                        <Input
                            id={"email"}
                            name={"email"}
                            type="email"
                            placeholder="Email"
                            className="text-sm"
                            required
                        />
                        <Input
                            id={"password"}
                            name={"password"}
                            type="password"
                            placeholder="Password"
                            className="text-sm"
                            required
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>

                </div>
            </form>
        </section>
    );
}