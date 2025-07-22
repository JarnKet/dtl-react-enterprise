import { useState, useEffect } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';

// Third Party
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';

// UI
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Services
import { createProduct, updateProductById } from '@/services/product';
import { Save } from 'lucide-react';
import type { Product } from '@/types/product';

export const Route = createFileRoute('/_private/product/mutate')({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		// validate and parse the search params into a typed state
		return {
			id: search.id as string | undefined,
			data: search.data as string | undefined,
		};
	},
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { id, data } = Route.useSearch();

	const isEditMode = Boolean(id);

	const [parsedData, setParsedData] = useState({} as Product);

	// Mutation
	const createMutation = useMutation({
		mutationFn: (payload: any) => createProduct(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success('Product created successfully');
			navigate({ to: '/product' });
		},
		onError: (error) => {
			toast.error(`Error creating product: ${error.message}`);
		},
	});

	const updateMutation = useMutation({
		mutationFn: (payload: any) => updateProductById(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success('Product updated successfully');
			navigate({ to: '/product' });
		},
		onError: (error) => {
			toast.error(`Error updating product: ${error.message}`);
		},
	});

	// Function
	// const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();

	// 	const formData = new FormData(event.currentTarget);
	// 	const data = {
	// 		title: formData.get('title'),
	// 		description: formData.get('description'),
	// 		price: parseFloat(formData.get('price') as string),
	// 	};

	// 	console.log('Payload to send:', data);

	// 	if (isEditMode) {
	// 		updateMutation.mutate(data);
	// 	} else {
	// 		createMutation.mutate(data);
	// 	}
	// };

	// Effects
	useEffect(() => {
		if (isEditMode && data) {
			setParsedData(JSON.parse(data as string));
		}
	}, [id, data]);

	// console.log('Id', id);
	// console.log('Data', JSON.parse(data as string));

	// Data
	const isPending = createMutation.isPending || updateMutation.isPending;

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
						<BreadcrumbPage>
							{isEditMode ? 'Edit Product' : 'Create Product'}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Card>
				<CardHeader>
					<CardTitle>
						{isEditMode ? 'Edit Product' : 'Create Product'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Form for creating/updating product */}

					{/* <form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter product title"
								required
								defaultValue={
									isEditMode ? parsedData.title : ''
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								name="description"
								placeholder="Enter product description"
								required
								defaultValue={
									isEditMode ? parsedData.description : ''
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Price</Label>
							<Input
								id="price"
								name="price"
								type="number"
								placeholder="Enter product price"
								required
								defaultValue={
									isEditMode ? parsedData.price : ''
								}
							/>
						</div>

						<div className="flex w-full items-center justify-end">
							<Button>
								{isPending ? (
									'Saving...'
								) : (
									<>
										<Save />
										Save Product
									</>
								)}
							</Button>
						</div>
					</form> */}

					<Formik
						enableReinitialize
						initialValues={{
							title: isEditMode ? parsedData.title : '',
							description: isEditMode
								? parsedData.description
								: '',
							price: isEditMode ? parsedData.price : '',
						}}
						validate={(values) => {
							const errors: Record<string, string> = {};
							if (!values.title) {
								errors.title = 'Title is required';
							}
							if (!values.description) {
								errors.description = 'Description is required';
							}
							if (!values.price) {
								errors.price = 'Price is required';
							} else if (isNaN(values.price)) {
								errors.price = 'Price must be a number';
							}
							return errors;
						}}
						onSubmit={(value) => {
							console.log('Submitted Values:', value);

							if (isEditMode) {
								updateMutation.mutate(value);
							} else {
								createMutation.mutate(value);
							}
						}}
					>
						{({
							values,
							handleChange,
							errors,
							handleSubmit,
							handleBlur,
						}) => (
							<form
								onSubmit={handleSubmit}
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										name="title"
										placeholder="Enter product title"
										// required
										value={values.title}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{errors.title ? (
										<small className="text-red-500">
											{errors.title}
										</small>
									) : null}
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">
										Description
									</Label>
									<Input
										id="description"
										name="description"
										placeholder="Enter product description"
										// required
										value={values.description}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{errors.title ? (
										<small className="text-red-500">
											{errors.description}
										</small>
									) : null}
								</div>
								<div className="space-y-2">
									<Label htmlFor="price">Price</Label>
									<Input
										id="price"
										name="price"
										type="number"
										placeholder="Enter product price"
										// required
										value={values.price}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{errors.price ? (
										<small className="text-red-500">
											{errors.price}
										</small>
									) : null}
								</div>

								<div className="flex w-full items-center justify-end">
									<Button
										type="submit"
										disabled={isPending}
									>
										{isPending ? (
											'Saving...'
										) : (
											<>
												<Save />
												Save Product
											</>
										)}
									</Button>
								</div>
							</form>
						)}
					</Formik>
				</CardContent>
			</Card>
		</div>
	);
}
