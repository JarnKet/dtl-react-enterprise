import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: Root,
});

function Root() {
	return (
		<>
			<Outlet />
			{/* <ReactQueryDevtools
				position={'bottom'}
				buttonPosition={'bottom-left'}
			/> */}
			<Toaster
				position={'bottom-right'}
				richColors
			/>
		</>
	);
}
