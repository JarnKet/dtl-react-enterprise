// Third Party
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

// UI
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Services
import { getRemoteJobById } from '@/services/remote-job';

// Types
import type { RemoteJob } from '@/types/remote-job';

export const Route = createFileRoute('/_private/remote-job/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	// Query
	const {
		data: res,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['remote-jobs', id],
		queryFn: () => getRemoteJobById(id),
		enabled: !!id,
	});

	const data = res;

	console.log('Data', data);

	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="cursor-pointer"
							onClick={() => history.back()}
						>
							Remote Job
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator />

					<BreadcrumbItem>
						<BreadcrumbPage>Job Details</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
