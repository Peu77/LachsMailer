import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "./CONSTANT.ts";

export interface EmailEntity {
    id: number;
    subject: string;
    body: string;
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

export interface TargetVariableEntity {
    id: number;
    target: TargetEntity;
    key: string;
    value: string;
}

export interface TrackerEntity {
    id: number;
    createdAt: Date;
    opened: boolean;
    openedAt: Date;
    clicked: boolean;
    clickedAt: Date;
    ipAddress: string;
    headers: string;
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
        mutationFn: async (email: { subject: string; body: string }) => {
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
           await  queryClient.invalidateQueries(["emails"]);
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