import {IUser} from "./user.model";
import {JSONObject, JSONValue} from "@twilio/conversations";

export const getUserFullName = (user: IUser) => {
    return `${user?.firstName} ${user?.lastName}`;
}
export const isValidUser = (value: JSONValue): boolean =>{
    console.log("type of value", typeof value);
    if (typeof value !== 'object' || value === null) return false; // Check if it's an object and not null

    const obj = value as JSONObject;

    return (
        typeof obj.id === 'string' &&
        typeof obj.firstName === 'string' &&
        typeof obj.lastName === 'string'
    );
}
