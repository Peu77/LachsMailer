import {EmailEntity, useCancelSchedule, useDeleteEmailMutation, useDistributeScheduleDates} from "@/api/emailApi.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Target} from "@/emails/target.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";

export const EmailCard= ({email}: {email: EmailEntity}) => {
    const deleteEmail = useDeleteEmailMutation(email.id)
    const distributeScheduleDates = useDistributeScheduleDates(email.id)
    const cancelSchedule = useCancelSchedule(email.id)
    const [days, setDays] = useState(30)
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
                <Button variant="destructive" onClick={() => cancelSchedule.mutateAsync().then(() => {
                    toast({
                        title: "Email",
                        description: "the email has been canceled",
                    })
                })}>Cancel</Button>
                <Button onClick={() => distributeScheduleDates.mutate(days)}>Distribute</Button>
                <Input placeholder={"days"} style={{maxWidth: "90px"}} type="number" value={days} onChange={(e) => setDays(Number(e.target.value))}/>
                <p>days</p>
            </CardFooter>
        </Card>
    )
}