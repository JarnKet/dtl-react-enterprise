import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

// UI
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {Button} from "@/components/ui/button.tsx"

// Icons
import {LogOut} from "lucide-react";

// Constants
import {AUTH_KEY} from "@/constants";

export const Route = createFileRoute('/_private')({
    component: RouteComponent,
    beforeLoad: async ({location}) => {
        const stringData = localStorage.getItem(AUTH_KEY) || "";

        const parsedData = JSON.parse(stringData);

        console.log("parsedData", parsedData);


        const isAuthenticated = parsedData?.email;

        if (!isAuthenticated) {
            throw redirect({
                to: "/",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
})

function RouteComponent() {
    return <SidebarProvider>
        <AppSidebar/>

        <SidebarInset className={"relative"}>
            <header className={"w-full p-4 sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b"}>
                <nav className={"flex items-center justify-between"}>
                    <div className={"flex items-center gap-4"}>
                        <SidebarTrigger/>
                        <h1 className={"font-bold text-xl"}>CRM Admin</h1>
                    </div>

                    <div>
                        <Button size={"icon"}>
                            <LogOut/>
                        </Button>
                    </div>
                </nav>
            </header>
            <main className={"p-4"}>
                <Outlet/>
            </main>
        </SidebarInset>
    </SidebarProvider>
}
