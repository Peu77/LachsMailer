import {useGetEmails} from "@/api/emailApi.ts";
import {cn} from "@/lib/utils.ts";
import {EmailCard} from "@/emails/emailCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CreateEmailDialog} from "@/emails/dialogs/createEmailDialog.tsx";
import {useDialogStore} from "@/store/dialogStore.ts";
import {Input} from "@/components/ui/input.tsx";
import {useApiKeyStore} from "@/store/apiKeyStore.ts";

export const Emails = () => {
    const emailQuery = useGetEmails()
    const {apiKey, setApiKey, isValid} = useApiKeyStore()
    const {setDialog} = useDialogStore()

    return (
        <div className="p-4">
            <div className="flex gap-2">
                <Button onClick={() => setDialog(<CreateEmailDialog/>)}>Create Email</Button>
                <Input value={apiKey}
                       className={isValid ? "" : "border-red-300"}
                       onChange={e => setApiKey(e.target.value)}
                       placeholder="api key"/>
            </div>

            {emailQuery.isLoading && <div>Loading...</div>}
            {emailQuery.isError && <p className={"text-red-300"}>Couldn't load emails</p>}
            {emailQuery.isSuccess && (
                <div className={cn("flex-wrap flex gap-4 mt-4")}>
                    {emailQuery.data?.map(email => (
                        <EmailCard email={email} key={email.id}/>
                    ))}
                </div>
            )}
        </div>
    )
}