import {TargetEntity} from "@/api/emailApi.ts";
import {cn} from "@/lib/utils.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";

export const Target = ({target}: { target: TargetEntity }) => {
    return (
        <div className="border-2 p-2 rounded cursor-pointer space-y-2 ">
            <div className="flex justify-between">
                <p>email: {target.email}</p>
                {target.sendAt && <p>sending at: {new Date(target.sendAt).toLocaleString()}</p>}
            </div>


            {target.trackers && target.trackers.length > 0 && (
                <div>
                    <p>Tracker:</p>
                    <Accordion type={"single"} collapsible>
                        {target.trackers.sort((a, b) => a.id - b.id).map(tracker => (
                            <AccordionItem value={tracker.id.toString()} key={tracker.id}>
                                <AccordionTrigger className={cn(
                                    "text-red-300",
                                    tracker.openedAt !== null ? "text-orange-300" : "",
                                    tracker.sessions?.length > 0 ? "text-green-300" : "",
                                )}>
                                    <div className="flex justify-between w-full px-5">
                                        <p>tracker id: {tracker.id}</p>
                                        <p>created at: {new Date(tracker.createdAt).toLocaleString()}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5">
                                    <p>opened
                                        at: {tracker.openedAt ? new Date(tracker.openedAt).toLocaleString() : "not yet"}</p>

                                    {tracker.sessions && tracker.sessions.length > 0 && (
                                        <div className="mt-2">
                                            <b>Sessions:</b>
                                            {tracker.sessions.sort((a,b) => a.id - b.id).map(session => (
                                                <div className={cn(
                                                    "mb-2 border-2 p-2",
                                                    session.endAt !== null ? "border-green-400" : "border-orange-400"
                                                )} key={session.id}>
                                                    <p>Session id: {session.id}</p>
                                                    <p>from: {new Date(session.startAt).toLocaleString()}</p>
                                                    <p>to: {session.endAt ? new Date(session.endAt).toLocaleString() : "not yet"}</p>
                                                    <p>ip: {session.ipAddress}</p>
                                                    <p>user agent: {session.userAgent}</p>
                                                    <p>platform: {session.platform}</p>
                                                    <p>language: {session.language}</p>
                                                    <p>cookies enabled: {session.cookiesEnabled ? "yes" : "no"}</p>
                                                    <p>screen size: {session.screenSize}</p>
                                                    <p>window size: {session.windowSize}</p>
                                                    {session.submissions && session.submissions.length > 0 && (
                                                        <div>
                                                            <b>Submissions:</b>
                                                            {session.submissions.map(submission => (
                                                                <div className="pb-2 border-b-2" key={submission.id}>
                                                                    <p>username: {submission.username}</p>
                                                                    <p>password: {submission.password}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                </div>
            )}

        </div>
    )
}