import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Emails} from "@/emails/emails.tsx";
import "./global.css"
import {Toaster} from "@/components/ui/toaster.tsx";
import {useDialogStore} from "@/store/dialogStore.ts";
import {Dialog} from "@/components/ui/dialog.tsx";

const queryClient = new QueryClient()

function App() {
    const {dialog, setDialog} = useDialogStore()

    return (
        <>
            <QueryClientProvider client={queryClient}>
              <Dialog children={dialog}
                                   open={dialog !== null}
                                   onOpenChange={() => setDialog(null)}/>
                <Toaster/>
                <Emails/>
            </QueryClientProvider>
        </>
    )
}

export default App
