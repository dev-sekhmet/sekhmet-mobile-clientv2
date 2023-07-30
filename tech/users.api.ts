import api from "./api";
import {IUser} from "../shared/user.model";

export const fetchUsers = async (search = '', pageable = {}): Promise<IUser[]> => {
    const response = await api.get<IUser[]>('/users', {
        params: {
            search,
            ...pageable
        }
    });
    return response.data;
};

export const fetchUser = async (id: string): Promise<IUser> => {
    const response = await api.get<IUser>(`/users/${id}`);
    return response.data;
};
