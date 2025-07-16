import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import './index.css'

// Import the generated route tree
import {routeTree} from './routeTree.gen'


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,

            retry: 2,
            staleTime: 1000 * 60, // 1 minute
        },
    },
})
// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </StrictMode>,
    )
}