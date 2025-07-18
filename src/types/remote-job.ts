export interface RemoteJob {
	id: number | string;
	url: string;
	jobSlug: string;
	jobTitle: string;
	companyName: string;
	companyLogo: string;
	jobIndustry: string[];
	jobType: string[];
	jobGeo: string;
	jobLevel: string;
	jobExcerpt: string;
	jobDescription: string;
	pubDate: string;
	salaryMin: number;
	salaryMax: number;
	salaryCurrency: string;
	salaryPeriod: string;
}
