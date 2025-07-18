import { useState } from 'react';

// Third Party
import {
	createFileRoute,
	useNavigate,
	type NavigateOptions,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';

// UI
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

// Services
import { getRemoteJobs } from '@/services/remote-job.ts';

// Types
import type { RemoteJob } from '@/types/remote-job';

// Utils and Helpers
import { formatDate } from '@/utils';

export const Route = createFileRoute('/_private/remote-job/')({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		// validate and parse the search params into a typed state
		return {
			tag: search.tag ? String(search.tag) : '',
		};
	},
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();

	// States
	const [filter, setFilter] = useState({
		tag: search.tag,
	});

	const debouncedTagSearch = useDebounce(filter.tag, 300);

	// Query
	const {
		data: res,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['remote-jobs', debouncedTagSearch],
		queryFn: () =>
			getRemoteJobs({
				params: {
					tag: debouncedTagSearch,
				},
			}),
	});

	// Functions
	const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter({ ...filter, tag: e.target.value });

		navigate({
			search: {
				tag: e.target.value,
			},
			replace: true,
		} as NavigateOptions);
	};

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const data: RemoteJob[] = res?.jobs;
	// const remoteJobs = data?.jobs as RemoteJob[];

	console.log('Remote Jobs:', data);

	return (
		<div className="w-full space-y-6">
			{/* Breadcrumb */}
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Remote Job</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Filter Section */}
			<Card>
				<CardHeader>
					<CardTitle>Filter Remote Jobs</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						placeholder="Search jobs by tag..."
						className="max-w-sm"
						value={filter.tag}
						// onChange={(e) =>
						// 	setFilter({ ...filter, tag: e.target.value })
						// }
						onChange={handleTagSearchChange}
					/>
				</CardContent>
			</Card>

			{/* Data Section */}
			{isLoading ? (
				<TableSkeleton />
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Remote Jobs </CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableCaption>
								A list of remote jobs available.
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="">No.</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Company</TableHead>
									<TableHead className="">Industry</TableHead>
									<TableHead className="">Type</TableHead>
									<TableHead className="">Location</TableHead>
									<TableHead className="">Level</TableHead>
									<TableHead className="">Industry</TableHead>
									<TableHead className="">Excerpt</TableHead>
									<TableHead className="">
										Publish Date
									</TableHead>
									<TableHead className="">Salary</TableHead>
									<TableHead className="">
										Salary Period
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={12}
											className="text-center"
										>
											No remote jobs found.
										</TableCell>
									</TableRow>
								) : (
									data?.map((item, index) => (
										<TableRow
											key={item.id}
											className="hover:bg-muted cursor-pointer"
											onClick={() =>
												navigate({
													to: '/remote-job/$id',
													params: {
														id: item.id,
													},
												} as NavigateOptions)
											}
										>
											<TableCell className="font-medium">
												{index + 1}
											</TableCell>
											<TableCell>
												{item.jobTitle}
											</TableCell>
											<TableCell>
												{item.companyName}
											</TableCell>
											<TableCell>
												{item.jobIndustry.join(', ')}
											</TableCell>
											<TableCell>
												{item.jobType.join(', ')}
											</TableCell>
											<TableCell>{item.jobGeo}</TableCell>
											<TableCell>
												{item.jobLevel}
											</TableCell>
											<TableCell>
												{item.jobIndustry.join(', ')}
											</TableCell>
											<TableCell>
												{item.jobExcerpt?.slice(0, 100)}
												...
											</TableCell>
											<TableCell className="text-right">
												{formatDate({
													date: item.pubDate,
													formatString: 'dd/MM/yyyy',
												})}
											</TableCell>
											<TableCell>
												$
												{item.salaryMin?.toLocaleString()}{' '}
												- $
												{item.salaryMax?.toLocaleString()}
											</TableCell>
											<TableCell>
												{item.salaryPeriod}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter>
						<CardDescription>
							Showing {data.length} remote jobs
						</CardDescription>
					</CardFooter>
				</Card>
			)}
		</div>
	);
}
