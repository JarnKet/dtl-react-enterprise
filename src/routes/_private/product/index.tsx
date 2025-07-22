import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

// Third Party
import { useNavigate, type NavigateOptions } from '@tanstack/react-router';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Icons
import { Plus } from 'lucide-react';

// Services
import { getProducts } from '@/services/product';

import type { Product } from '@/types/product';

export const Route = createFileRoute('/_private/product/')({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		// validate and parse the search params into a typed state
		return {
			q: search.q ? String(search.q) : '',
		};
	},
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();

	// States
	const [filter, setFilter] = useState({
		q: search.q,
	});

	const debouncedTagSearch = useDebounce(filter.q, 300);

	// Query
	const {
		data: res,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['products', debouncedTagSearch],
		queryFn: () =>
			getProducts({
				params: {
					q: debouncedTagSearch,
				},
			}),
	});

	// Functions
	const handleTagSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter({ ...filter, q: e.target.value });

		navigate({
			search: {
				q: e.target.value,
			},
			replace: true,
		} as NavigateOptions);
	};

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const data: Product[] = res?.products;

	console.log('Products:', data);

	return (
		<div className="w-full space-y-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Product</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Filter Section */}
			<Card>
				<CardHeader>
					<CardTitle>Filter Products</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						placeholder="Search jobs by tag..."
						className="max-w-sm"
						value={filter.q}
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
						<CardTitle>
							<div className="flex w-full items-center justify-between">
								<h2>Product List</h2>
								<Button
									onClick={() =>
										navigate({
											to: '/product/mutate',
										})
									}
									variant="outline"
								>
									<Plus className="mr-2" />
									Add Product
								</Button>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{data.length === 0 ? (
							<p>No products found.</p>
						) : (
							// <ul>
							// 	{data.map((product) => (
							// 		<li key={product.id}>{product.title}</li>
							// 	))}
							// </ul>
							<Table>
								<TableCaption>
									A list of products fetched from the API.
								</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Thumbnail</TableHead>

										<TableHead>Title</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.map((product) => (
										<TableRow
											className="cursor-pointer"
											key={product.id}
											onClick={() => {
												navigate({
													to: '/product/$id',
													params: {
														id: product.id.toString(),
													},
												});
											}}
										>
											<TableCell>
												<Avatar>
													<AvatarImage
														src={product.thumbnail}
														alt={product.title}
													/>
													<AvatarFallback>
														{product.title.charAt(
															0
														)}
													</AvatarFallback>
												</Avatar>
											</TableCell>
											<TableCell>
												{product.title}
											</TableCell>
											<TableCell>
												{product.description}
											</TableCell>
											<TableCell>
												{product.price}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
