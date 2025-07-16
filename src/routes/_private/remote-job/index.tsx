// Third Party
import {createFileRoute} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";

// Services
import {getRemoteJobs} from "@/services/remote-job.ts";

export const Route = createFileRoute('/_private/remote-job/')({
    component: RouteComponent,
})

function RouteComponent() {

    const {data, isLoading, error} = useQuery({
        queryKey: ["remote-jobs"],
        queryFn: () => getRemoteJobs({}),
       

    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const remoteJobs = data?.data || [];

    console.log("Remote Jobs:", remoteJobs);


    return <div>Hello "/_private/remote-job/"!</div>
}
