import { format } from 'date-fns';

type FormatDateProps = {
	date: string | Date;
	formatString?: string;
};

export const formatDate = ({ date, formatString }: FormatDateProps): string => {
	return format(new Date(date), formatString || 'MMMM dd, yyyy');
};
