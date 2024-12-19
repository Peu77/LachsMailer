import {TargetEntity} from "@/api/emailApi.ts";

export const Target = ({target}: {target: TargetEntity}) => {
    return (

        <div className="border-2 p-2 rounded cursor-pointer flex justify-between">
            <p>email: {target.email}</p>
            <p>sending at: {new Date(target.sendAt).toLocaleString()}</p>
        </div>
    )
}