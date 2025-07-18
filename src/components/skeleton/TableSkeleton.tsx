import { Skeleton } from '../ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
	className?: string;
}

const TableSkeleton = ({
	rows = 5,
	columns = 4,
	showHeader = true,
	className,
}: TableSkeletonProps) => {
	return (
		<div className={className}>
			<Table>
				{showHeader && (
					<TableHeader>
						<TableRow>
							{Array.from({ length: columns }).map((_, index) => (
								<TableHead key={`header-${index}`}>
									<Skeleton className="h-4 w-full" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
				)}
				<TableBody>
					{Array.from({ length: rows }).map((_, rowIndex) => (
						<TableRow key={`row-${rowIndex}`}>
							{Array.from({ length: columns }).map(
								(_, colIndex) => (
									<TableCell
										key={`cell-${rowIndex}-${colIndex}`}
									>
										<Skeleton
											className="h-4 w-full"
											style={{
												width: `${
													Math.floor(
														Math.random() * 40
													) + 60
												}%`,
											}}
										/>
									</TableCell>
								)
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TableSkeleton;
