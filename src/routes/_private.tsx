import {
	createFileRoute,
	Outlet,
	redirect,
	useNavigate,
} from '@tanstack/react-router';

// UI
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/app-sidebar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Icons
import { LogOut } from 'lucide-react';

// Stores
import useUserStore from '@/store/auth';

// Constants

export const Route = createFileRoute('/_private')({
	component: RouteComponent,
	beforeLoad: async ({ location }) => {
		const user = useUserStore.getState().user;

		const isAuthenticated = user?.accessToken;

		if (!isAuthenticated) {
			throw redirect({
				to: '/',
				search: {
					redirect: location.href,
				},
			});
		}
	},
});

function RouteComponent() {
	const navigate = useNavigate();

	// Store
	const clearUser = useUserStore((state) => state.clearUser);

	const handleLogout = () => {
		clearUser();

		navigate({
			to: '/',
			replace: true,
		});
	};

	return (
		<SidebarProvider>
			<AppSidebar />

			<SidebarInset className={'relative overflow-x-auto'}>
				<header
					className={
						'w-full p-4 sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b'
					}
				>
					<nav className={'flex items-center justify-between'}>
						<div className={'flex items-center gap-4'}>
							<SidebarTrigger />
							<h1 className={'font-bold text-xl'}>CRM Admin</h1>
						</div>

						<div>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button size={'icon'}>
										<LogOut />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure for Logout??
										</AlertDialogTitle>
										<AlertDialogDescription>
											You will need to login again to
											access the admin panel.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleLogout}
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</nav>
				</header>
				<main className={'p-4'}>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
