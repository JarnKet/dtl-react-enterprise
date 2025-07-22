import { createFileRoute, useNavigate } from '@tanstack/react-router';

// Third Party
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// UI
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
import { toast } from 'sonner';

// Services
import { getProductById, deleteProductById } from '@/services/product';

// Types
import type { Product } from '@/types/product';
import { Pen, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/_private/product/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// Query
	const {
		data: res,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['products', id],
		queryFn: () => getProductById(id),
		enabled: !!id,
	});

	// Mutation
	const deleteProductMutation = useMutation({
		mutationFn: () => deleteProductById(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			history.back();
			toast.success('Product deleted successfully');
		},
		onError: () => {
			toast.error('Error deleting product');
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	// Data
	const data: Product = res;

	console.log('Product Data', data);

	return (
		<div className="w-full space-y-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="cursor-pointer"
							onClick={() => history.back()}
						>
							Products
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator />

					<BreadcrumbItem>
						<BreadcrumbPage>Product Details</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div>
				<Button
					onClick={() => {
						navigate({
							to: '/product/mutate',
							search: {
								id: data.id.toString(),
								data: JSON.stringify(data),
							},
						});
					}}
				>
					<Pen /> Edit
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{data.title}</CardTitle>
					<CardDescription>{data.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<Avatar className="mx-auto w-[500px] h-[500px]">
						<AvatarImage
							src={data.thumbnail}
							alt={data.title}
						/>
						<AvatarFallback>{data.title.charAt(0)}</AvatarFallback>
					</Avatar>

					<p>Price: ${data.price}</p>
					<p>Category: {data.category}</p>
				</CardContent>
				<CardFooter>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant={'destructive'}>
								{deleteProductMutation.isPending ? (
									<>Deleting...</>
								) : (
									<>
										Delete <Trash2 />
									</>
								)}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your product and remove
									your product data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										deleteProductMutation.mutate()
									}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardFooter>
			</Card>
		</div>
	);
}
