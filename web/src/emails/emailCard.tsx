import {EmailEntity, useDeleteEmailMutation, useDistributeScheduleDates} from "@/api/emailApi.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Target} from "@/emails/target.tsx";

export const EmailCard= ({email}: {email: EmailEntity}) => {
    const deleteEmail = useDeleteEmailMutation(email.id)
    const distributeScheduleDates = useDistributeScheduleDates(email.id)
    const {toast} = useToast()

    return (
        <Card key={email.id} className="w-[600px]">
            <CardHeader>{email.subject}</CardHeader>
            <CardContent className="space-y-4">
                <Textarea rows={5} value={email.body} disabled/>

                <div className="space-y-1">
                    {email.targets && email.targets.map(target =>
                        <Target target={target} key={target.id}/>
                    )}
                </div>

            </CardContent>

            <CardFooter className="space-x-2">
                <Button variant="destructive" disabled={deleteEmail.isPaused} onClick={() => deleteEmail.mutateAsync().then(() => {
                    toast({
                        title: "Email",
                        description: "the email has been deleted",
                    })
                })}>Delete</Button>
                <Button onClick={() => distributeScheduleDates.mutate(4)}>Distribute</Button>
            </CardFooter>
        </Card>
    )
}