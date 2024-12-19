import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Emails} from "@/emails/emails.tsx";
import "./global.css"

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Emails />
            </QueryClientProvider>
        </>
    )
}

export default App
