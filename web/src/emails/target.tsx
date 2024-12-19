import {TargetEntity} from "@/api/emailApi.ts";
import {cn} from "@/lib/utils.ts";

export const Target = ({target}: {target: TargetEntity}) => {
    return (
        <div className="border-2 p-2 rounded cursor-pointer space-y-2 ">
            <div className="flex justify-between">
                <p>email: {target.email}</p>
                {target.sendAt && <p>sending at: {new Date(target.sendAt).toLocaleString()}</p>}
            </div>


            {target.trackers && target.trackers.length > 0 && (
                <div>
                    <p>Tracker:</p>
                    {target.trackers.map(tracker => (
                        <div key={tracker.id} className={cn("border-2 p-2 overflow-x-scroll", tracker.opened ? "border-orange-300" : "", tracker.clicked ? "border-green-300": "")}>
                            <p>created at: {new Date(tracker.createdAt).toLocaleString()}</p>
                            <p>opened: {tracker.opened ? "yes" : "no"}</p>
                            <p>opened at: {tracker.openedAt ? new Date(tracker.openedAt).toLocaleString() : "not yet"}</p>
                            <p>clicked: {tracker.clicked ? "yes" : "no"}</p>
                            <p>clicked at: {tracker.clickedAt ? new Date(tracker.clickedAt).toLocaleString() : "not yet"}</p>
                            <p>ip: {tracker.ipAddress}</p>
                            <p>headers: {tracker.headers}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}