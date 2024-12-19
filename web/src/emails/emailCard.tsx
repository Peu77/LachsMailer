import {EmailEntity, useDeleteEmailMutation} from "@/api/emailApi.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

export const EmailCard= ({email}: {email: EmailEntity}) => {
    const deleteEmail = useDeleteEmailMutation(email.id)

    return (
        <Card key={email.id} className="w-[600px]">
            <CardHeader>{email.subject}</CardHeader>
            <CardContent>{email.body}</CardContent>

            <CardFooter className="space-x-2">
                <Button variant="destructive" disabled={deleteEmail.isPaused} onClick={() => deleteEmail.mutate()}>Delete</Button>
                <Button>Edit</Button>
            </CardFooter>
        </Card>
    )
}