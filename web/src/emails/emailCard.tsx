import {
    EmailEntity,
    TrackerEntity,
    useCancelSchedule,
    useDeleteEmailMutation,
    useDistributeScheduleDates
} from "@/api/emailApi.ts";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Target} from "@/emails/target.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useMemo, useState} from "react";
import {useDialogStore} from "@/store/dialogStore.ts";
import {SetDataDialog} from "@/emails/dialogs/setDataDialog.tsx";
import {EmailChart} from "@/emails/emailChart.tsx";

export const EmailCard = ({email}: { email: EmailEntity }) => {
    const deleteEmail = useDeleteEmailMutation(email.id)
    const distributeScheduleDates = useDistributeScheduleDates(email.id)
    const cancelSchedule = useCancelSchedule(email.id)
    const {setDialog} = useDialogStore()
    const [days, setDays] = useState(30)
    const {toast} = useToast()

    const chartData: {
        emails: number,
        send: number,
        open: number,
        click: number,
        submit: number
    } = useMemo(() => {
        if (!email.targets) return {emails: 0, send: 0, open: 0, click: 0, submit: 0}

        const lastTrackers = email.targets.map(target => target.trackers.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]).filter((tracker: TrackerEntity) => {
            if (!tracker) return false
            return new Date(tracker.createdAt).getTime() > new Date(email.lastDistributedAt).getTime()
        }) as TrackerEntity[]

        const send = lastTrackers.length
        const open = lastTrackers.filter(tracker => tracker.sessions.length > 0).flat().length
        const click = lastTrackers.filter(tracker => tracker.openedAt != null).length
        const submit = lastTrackers.flatMap(tracker => tracker.sessions.flatMap(session => session.submissions)).length

        return {emails: email.targets.length, send, open, click, submit}
    }, [email.targets])

    return (
        <Card key={email.id} className="w-[600px]">
            <CardHeader>
                <CardTitle className="">{email.subject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <EmailChart chartData={chartData}/>
                <p>From</p>
                <Input value={email.from} disabled/>
                <p>Body</p>
                <Textarea rows={5} value={email.body} disabled/>

                <div className="space-y-1">
                    {email.targets && email.targets.map(target =>
                        <Target target={target} key={target.id}/>
                    )}
                </div>

            </CardContent>

            <CardFooter className="space-x-2">
                <Button variant="destructive" disabled={deleteEmail.isPaused}
                        onClick={() => deleteEmail.mutateAsync().then(() => {
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
                <Input placeholder={"days"} style={{maxWidth: "90px"}} type="number" value={days}
                       onChange={(e) => setDays(Number(e.target.value))}/>
                <Button onClick={() => setDialog(<SetDataDialog emailId={email.id}/>)}>Set-data</Button>
            </CardFooter>
        </Card>
    )
}