import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";

export const Login = () => {
    const {id} = useParams()

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