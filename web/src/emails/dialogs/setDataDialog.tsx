import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {useSetEmailData} from "@/api/emailApi.ts";
import {useDialogStore} from "@/store/dialogStore.ts";


export const SetDataDialog = (params: { emailId: number }) => {
    const [users, setUsers] = useState<{
        email: string;
        variables: { key: string; value: string }[];
    }[]>([]);

    const {toast} = useToast()
    const {setDialog} = useDialogStore()
    const uploadEmailData = useSetEmailData(params.emailId);

    function onUploadFile(files: FileList | null) {
        const file = files?.item(0);
        if (!file) {
            return;
        }

        if (file.type !== "text/csv") {
            toast({
                title: "Invalid file",
                description: "Please upload a csv file"
            })
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!e.target?.result) {
                return;
            }

            const text = e.target.result.toString();
            const lines = text.split("\n").map((line) => line.trim());
            const variableKeys = lines[0].split(";").slice(1);

            const users = lines.splice(1).map((line: string) => {
                const [email, ...variableValues] = line.split(";");
                return {
                    email,
                    variables: variableValues.filter((value: string, valueI: number) => {
                        return value && variableKeys[valueI] && value !== "\r"
                    }).map((value: string, valueI: number) => {
                        return {key: variableKeys[valueI], value};
                    })
                }
            }).filter((user) => user.email);

            setUsers(users);
        };
        reader.readAsText(file);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Set Data</DialogTitle>
            </DialogHeader>

            <Input onChange={e => {
                onUploadFile(e.target.files);
            }} placeholder="csv" type="file"/>

            <DialogFooter>
                <Button disabled={users.length === 0 || uploadEmailData.isLoading} onClick={() => {
                    uploadEmailData.mutateAsync(users).then(() => {
                        toast({
                            title: "Data",
                            description: "Data has been uploaded",
                        })
                        setDialog(null);
                    })
                }}>Upload</Button>
            </DialogFooter>
        </DialogContent>
    )
}