import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "./CONSTANT.ts";

export interface EmailEntity {
    id: number;
    from: string;
    subject: string;
    body: string;
    lastDistributedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    targets: TargetEntity[];
}

export interface TargetEntity {
    id: number;
    sendAt: Date;
    email: string;
    emailEntity: EmailEntity;
    variables: TargetVariableEntity[];
    trackers: TrackerEntity[];
}

export interface TrackerEntity {
    id: number;
    createdAt: Date;
    openedAt: Date;
    ipAddress: string;
    headers: string;
    sessions: SessionEntity[];
}

export interface SessionEntity {
    id: number;
    startAt: Date;
    endAt: Date;
    ipAddress: string;
    userAgent: string;
    platform: string;
    language: string;
    cookiesEnabled: boolean;
    screenSize: string;
    windowSize: string;
    submissions: SubmissionEntity[];
}

export interface SubmissionEntity {
    id: number;
    username: string;
    password: string;
}

export interface TargetVariableEntity {
    id: number;
    target: TargetEntity;
    key: string;
    value: string;
}

export function useGetEmails() {
    return useQuery<EmailEntity[]>({
        queryKey: ["emails"],
        queryFn: async () => {
            const response = await axiosInstance.get<EmailEntity[]>("/email");
            return response.data
        }
    })
}

export function useCreateEmailMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["emails"],
        mutationFn: async (email: { from: string, subject: string; body: string }) => {
            const response = await axiosInstance.post<EmailEntity>("/email", email);
            return response.data
        },
        onSuccess: (data: EmailEntity) => {
            queryClient.setQueryData(["emails"], (oldData: EmailEntity[] | undefined) => {
                return oldData ? [...oldData, data] : [data]
            })
        }
    })
}

export function useDeleteEmailMutation(emailId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["emails", "delete", emailId],
        mutationFn: async () => axiosInstance.delete(`/email/${emailId}`),
        onSuccess: () => {
            queryClient.setQueryData(["emails"], (oldData: EmailEntity[] | undefined) => {
                return oldData?.filter(email => email.id !== emailId)
            })
        }
    })
}

export function useDistributeScheduleDates(emailId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["emails", "distribute", emailId],
        mutationFn: async (days: number) => {
            const response = await axiosInstance.put<TargetEntity[]>(`/email/${emailId}/scheduleIn/${days}`);
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["emails"]);
        }
    })
}

export function useCancelSchedule(emailId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["emails", "cancel", emailId],
        mutationFn: async () => {
            const response = await axiosInstance.put<TargetEntity[]>(`/email/${emailId}/cancel`);
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["emails"]);
        }
    })
}

export function useSetEmailData(emailId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["emails", "set-data", emailId],
        mutationFn: async (data: {
            email: string;
            variables: { key: string; value: string }[]
        }[]) => {
            const response = await axiosInstance.post<TargetEntity>(`/email/${emailId}/data`, data);
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["emails"]);
        }
    })
}