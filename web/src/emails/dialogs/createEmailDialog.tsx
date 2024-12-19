import {useCreateEmailMutation} from "@/api/emailApi.ts";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useDialogStore} from "@/store/dialogStore.ts";
import {Textarea} from "@/components/ui/textarea.tsx";

export const CreateEmailDialog = () => {
    const createEmail = useCreateEmailMutation();
    const {setDialog} = useDialogStore();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    return (
        <>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Email</DialogTitle>
                </DialogHeader>

                <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}/>
                <Textarea rows={10}  placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)}/>
                <DialogFooter>
                    <Button disabled={createEmail.isLoading} onClick={() => createEmail.mutateAsync({
                        subject,
                        body
                    }).then(() => setDialog(null))}>Create</Button>
                </DialogFooter>
            </DialogContent>

        </>

    )
}