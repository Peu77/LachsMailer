import {useGetEmails} from "@/api/emailApi.ts";
import {cn} from "@/lib/utils.ts";
import {EmailCard} from "@/emails/emailCard.tsx";

export const Emails = () => {
    const emailQuery = useGetEmails()

    return (
        <div className="p-4">
            <h1 className="text-3xl">Emails</h1>
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