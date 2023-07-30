import {ImageRequireSource, ImageSourcePropType} from 'react-native';
import {Client, Conversation, Message as TwilioMessage} from "@twilio/conversations";

export enum Status_Types_Enum {
  Online,
  Offline,
}

export enum Animation_Types_Enum {
  SlideTop,
  SlideBottom,
  SlideInRight,
  SlideInLeft,
}

export type TwilioProps = {
  twilioClient?: Client;
  conversation?: Conversation;
  unreadMessagesCount?: number;
  lastMessage?: string;
  messages?: Message[];
};

export enum CONVERSATION_TYPE {
  GROUP = 'GROUP',
  DUAL = 'DUAL'
}

export enum TWILIO_ROLE {
  CHANNEL_USER = 'CHANNEL_USER',
  CHANNEL_ADMIN = 'CHANNEL_ADMIN'
}

export type Message = { msg: TwilioMessage, author: string | undefined | null, deleted?: boolean };
export const APP_TIME_FORMAT = 'HH:mm';
