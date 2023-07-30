import {TWILIO_ROLE} from "../data/sampleData";

export interface IUser {
    id?: any;
    login?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    activated?: boolean;
    langKey?: string;
    authorities?: any[];
    createdBy?: string;
    createdDate?: Date | null;
    lastModifiedBy?: string;
    imageUrl?: string;
    lastModifiedDate?: Date | null;
    resetDate?: Date | null;
    phoneNumber?: string;
    twilioRole?: TWILIO_ROLE;
}
