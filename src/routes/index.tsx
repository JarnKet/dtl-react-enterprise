import * as React from 'react';
import { useState } from 'react';

// Third Party
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Stores
import useUserStore from '@/store/auth';

// Constants
import { AUTH_KEY } from '@/constants';

// Services
import { Login } from '@/services/auth';

// Types
import type { UserAuth } from '@/types/auth';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const navigate = useNavigate();

	// Store
	const setUser = useUserStore((state) => state.setUser);

	// States
	const [showPassword, setShowPassword] = useState(false);

	// Mutation
	const loginMutation = useMutation({
		mutationFn: (payload: { username: string; password: string }) =>
			Login(payload),

		onSuccess: (data: UserAuth) => {
			console.log('Login successful:', data);

			// localStorage.setItem(AUTH_KEY, JSON.stringify(data));

			setUser(data);

			navigate({
				to: '/dashboard',
				replace: true,
			});
		},
		onError: (error) => {
			console.log('error', error);

			// alert('Login failed. Please check your credentials and try again.');
			toast.error(
				'Login failed. Please check your credentials and try again.'
			);
		},
	});

	// Functions
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const username = formData.get('username');
		const password = formData.get('password');

		const payload = {
			username: username as string,
			password: password as string,
		};

		console.log('Submit Value', payload);

		loginMutation.mutate(payload);
	};

	return (
		<section className="bg-muted h-screen">
			<form
				onSubmit={handleSubmit}
				className="flex h-full items-center justify-center"
			>
				{/* Logo */}
				<div className="flex flex-col items-center gap-6 lg:justify-start">
					<div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
						<h1 className="text-xl font-semibold">CRM System</h1>
						<Input
							id={'username'}
							name={'username'}
							type="text"
							placeholder="Enter your username..."
							className="text-sm"
							required
							defaultValue={'emilys'}
						/>
						<Input
							id={'password'}
							name={'password'}
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							className="text-sm"
							required
							defaultValue={'emilyspass'}
						/>

						<div className="flex items-center gap-2 w-full">
							<Checkbox
								id="show-password"
								checked={showPassword}
								onCheckedChange={(checked) =>
									setShowPassword(checked as boolean)
								}
							/>
							<Label htmlFor="show-password">Show Password</Label>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending
								? 'Logging in...'
								: 'Login'}
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
}
