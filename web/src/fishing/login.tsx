import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {axiosInstance} from "@/api/CONSTANT.ts";

export const Login = () => {
    const {id} = useParams()
    const [sessionId, setSessionId] = useState<number>(-1)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    useEffect(() => {
        if (!id) return

        axiosInstance.post<number>(`/tracker/startSession/${id}`, {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            screenSize: screen.width + "x" + screen.height,
            windowSize: window.innerWidth + "x" + window.innerHeight
        }).then(response => {
            setSessionId(response.data)
        }).catch(() => {
        })
    }, [id])

    useEffect(() => {
        if (sessionId === -1) return

        function handleKeyDown(e: KeyboardEvent) {
            const selected = document.activeElement?.id || "none"
            console.log("selected", selected)
            axiosInstance.post(`/tracker/pressKey/${sessionId}`, {key: e.key, selected}).catch(() => {
            })
        }

        function windowExit() {
            axiosInstance.put(`/tracker/endSession/${sessionId}`).catch(() => {
            })
        }


        let lastMouseUpdate = Date.now()
        function mouseMove(e: MouseEvent) {
            if (Date.now() - lastMouseUpdate < 400) return
            axiosInstance.post(`/tracker/mousePos/${sessionId}`, {x: e.clientX, y: e.clientY}).then(() => {
                lastMouseUpdate = Date.now()
            }).catch(() => {
            })
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener('beforeunload', windowExit)
        window.addEventListener('unload', windowExit)
        window.addEventListener('mousemove', mouseMove)


        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener('beforeunload', windowExit)
            window.removeEventListener('unload', windowExit)
            window.removeEventListener('mousemove', mouseMove)

            windowExit()
        }
    }, [sessionId]);

    function submit(e: React.FormEvent) {
        e.preventDefault()
        axiosInstance.post(`/tracker/submit/${sessionId}`, {username, password}).then(() => {
            alert("Submitted")
        }).catch(() => {
            alert("Failed to submit")
        })
    }

    return (
        <form onSubmit={submit}
            className="max-w-[600px] w-full  border-2 p-3 flex flex-col gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1>Login</h1>
            <Input onChange={e => setUsername(e.target.value)} id="username" placeholder={"Username"}/>
            <Input onChange={e => setPassword(e.target.value)} id="password" placeholder={"Password"} type="password"/>
            <Button>Login</Button>
            {id && <p>Track ID: {id}</p>}
        </form>
    )
}