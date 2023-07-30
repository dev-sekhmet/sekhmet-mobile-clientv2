import {IUser} from "../shared/user.model";
import api from "./api";

export const updateUser = async (user: IUser) => {
    const response = await api.patch('/account', user);
    return response.data;
};
