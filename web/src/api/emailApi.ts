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
    email: string;
    emailEntity: EmailEntity;
    variables: TargetVariableEntity[];
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