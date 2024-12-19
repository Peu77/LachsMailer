import {EmailEntity, useDeleteEmailMutation} from "@/api/emailApi.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {Textarea} from "@/components/ui/textarea.tsx";

export const EmailCard= ({email}: {email: EmailEntity}) => {
    const deleteEmail = useDeleteEmailMutation(email.id)
    const {toast} = useToast()

    return (
        <Card key={email.id} className="w-[600px]">
            <CardHeader>{email.subject}</CardHeader>
            <CardContent>
                <Textarea rows={5} value={email.body} disabled/>
            </CardContent>

            <CardFooter className="space-x-2">
                <Button variant="destructive" disabled={deleteEmail.isPaused} onClick={() => deleteEmail.mutateAsync().then(() => {
                    toast({
                        title: "Email",
                        description: "the email has been deleted",
                    })
                })}>Delete</Button>
                <Button>Edit</Button>
            </CardFooter>
        </Card>
    )
}