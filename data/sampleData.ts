import {IUser} from "../shared/user.model";

export enum ChatMemberScope {
    PARTICIPANT = 'PARTICIPANT',

    ADMIN = 'ADMIN',
}
export enum ChatType {
    TWO_USER = 'TWO_USER',

    GROUPE = 'GROUPE',
}


export const messages: IMessage[] = [
    {
    "id": "23489c4f-930e-4f1b-b338-9b30a3d4c021",
    "text": "Bonjour chef",
    "createdAt": "2022-01-25T21:14:19.133872",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "555773d2-60d7-11ec-8607-0242ac132222",
        "login": "dev2.sekhmet@gmail.com",
        "firstName": "Sekhmet",
        "lastName": "User 2",
        "email": "dev2.sekhmet@gmail.com",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
},{
    "id": "03489c4f-930e-4f1b-b338-9b30a3f4c991",
    "text": "Tu as vu le way la ?",
    "createdAt": "2022-01-24T21:14:19.133872",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "555773d2-60d7-11ec-8607-0242ac132222",
        "login": "dev2.sekhmet@gmail.com",
        "firstName": "Sekhmet",
        "lastName": "User 2",
        "email": "dev2.sekhmet@gmail.com",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
},{
    "id": "03489c4f-930e-4f1b-b338-9b30a3f4c021",
    "text": "Tu ne reponds pas ?",
    "createdAt": "2022-01-25T21:15:19.133872",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "555773d2-60d7-11ec-8607-0242ac132222",
        "login": "dev2.sekhmet@gmail.com",
        "firstName": "Sekhmet",
        "lastName": "User 2",
        "email": "dev2.sekhmet@gmail.com",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "0956fbd9-40a1-472c-9284-b00aa45709be",
    "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "createdAt": "2022-01-20T20:47:02.70609",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "0ec9f809-5f08-4283-98c4-9d2fdbc088b9",
    "text": "Ha d'accord",
    "createdAt": "2022-01-20T20:57:13.16977",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "555773d2-60d7-11ec-8607-0242ac132222",
        "login": "dev2.sekhmet@gmail.com",
        "firstName": "Sekhmet",
        "lastName": "User 2",
        "email": "dev2.sekhmet@gmail.com",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "4c90d08f-0a18-4f23-9f5d-8c46a9bd2753",
    "text": "Bonjour comment ut vas",
    "createdAt": "2022-01-19T21:14:19.133872",
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": "image/jpeg",
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "588bd561-4112-4c96-918b-6571a4b41d9c",
    "text": "Bonjour Nadine",
    "createdAt": "2022-01-19T20:57:25.614993",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "74a9dce4-63c0-427c-9a36-5b215653e63c",
    "text": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model",
    "createdAt": "2022-01-19T20:48:04.678819",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "7b4f5969-c6c6-45e9-a3e6-14131c283fda",
    "text": "",
    "createdAt": "2022-01-18T12:02:22.045658",
    "image": null,
    "video": null,
    "file": null,
    "audio": "chat-content/da134f53-ee9c-4a8b-b44f-6d94d50298db/audio/45fb84d2-efc1-4f5b-8435-8676a68f5d25-file_example_MP3_700KB.mp3",
    "contentTypeMedia": "audio/mpeg",
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "89b19331-de02-4b89-85ed-a1ba0334a393",
    "text": "",
    "createdAt": "2022-01-18T11:59:06.919601",
    "image": "chat-content/da134f53-ee9c-4a8b-b44f-6d94d50298db/image/c31ca117-273a-4284-a2c2-fca8983adc8e-téléchargement.jfif",
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": "image/jpeg",
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "8e5aa4d7-d1ee-4497-9455-55bb35899033",
    "text": "",
    "createdAt": "2022-01-19T21:00:10.865824",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "8fcb70b0-1625-41e8-ae6f-6993b54a0f99",
    "text": "",
    "createdAt": "2022-01-18T12:01:13.421335",
    "image": null,
    "video": null,
    "file": null,
    "audio": "chat-content/da134f53-ee9c-4a8b-b44f-6d94d50298db/audio/a2ec1e06-de01-4ab7-b65b-90875d281dca-file_example_MP3_700KB.mp3",
    "contentTypeMedia": "audio/mpeg",
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}, {
    "id": "9ea4852f-6a04-44c9-afe4-d796b9887ea7",
    "text": "Hhh",
    "createdAt": "2022-01-15T19:18:31.322051",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "555773d2-60d7-11ec-8607-0242ac132222",
        "login": "dev2.sekhmet@gmail.com",
        "firstName": "Sekhmet",
        "lastName": "User 2",
        "email": "dev2.sekhmet@gmail.com",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
},
    {
    "id": "b7ef83a1-b8f5-4c5c-81e3-c014ae0e0268",
    "text": "",
    "createdAt": "2022-01-19T20:47:50.005667",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
},
    {
        "id": "aef2aee9-4585-4432-ab30-ad9f1eb27688",
        "text": "",
        "createdAt": "2022-01-18T11:59:35.693307",
        "image": null,
        "video": "chat-content/da134f53-ee9c-4a8b-b44f-6d94d50298db/video/8e1de5c5-5e33-49f0-9d62-511040bf7c2a-sample-mp4-file-small.mp4",
        "file": null,
        "audio": null,
        "contentTypeMedia": "video/mp4",
        "system": null,
        "sent": null,
        "received": null,
        "pending": null,
        "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
        "user": {
            "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
            "login": "admin",
            "firstName": "Administrator",
            "lastName": "Administrator",
            "email": "admin@localhost",
            "activated": true,
            "langKey": "en",
            "imageUrl": "",
            "resetDate": null
        }
    },
    {
    "id": "efb6457f-0863-4940-bdec-133eed157e49",
    "text": "tu sais qui je suis?",
    "createdAt": "2022-01-19T21:11:38.082962",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
},
    {
        "id": "e4da9228-e21c-477b-9327-0a0236e190fb",
        "text": "",
        "createdAt": "2022-01-18T12:19:32.776975",
        "image": "chat-content/da134f53-ee9c-4a8b-b44f-6d94d50298db/image/6ca5e5c2-4a2a-4b8c-912a-18ca87c945d9-FE76AF5A-A97A-4F01-906C-E23F7DE9F3C0.jpeg",
        "video": null,
        "file": null,
        "audio": null,
        "contentTypeMedia": "image/jpeg",
        "system": null,
        "sent": null,
        "received": null,
        "pending": null,
        "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
        "user": {
            "id": "555773d2-60d7-11ec-8607-0242ac132222",
            "login": "dev2.sekhmet@gmail.com",
            "firstName": "Sekhmet",
            "lastName": "User 2",
            "email": "dev2.sekhmet@gmail.com",
            "activated": true,
            "langKey": "en",
            "imageUrl": "",
            "resetDate": null
        }
    },
    {
    "id": "f3b4d9ab-750d-4771-975a-d2cda06c0e2f",
    "text": "sss",
    "createdAt": "2022-01-18T12:31:02.789086",
    "image": null,
    "video": null,
    "file": null,
    "audio": null,
    "contentTypeMedia": null,
    "system": null,
    "sent": null,
    "received": null,
    "pending": null,
    "chat": {"id": "da134f53-ee9c-4a8b-b44f-6d94d50298db", "icon": null, "name": "Sekhmet Api", chatType: ChatType.TWO_USER},
    "user": {
        "id": "3607e6a7-5b08-4b36-b73c-373deb72f9e8",
        "login": "admin",
        "firstName": "Administrator",
        "lastName": "Administrator",
        "email": "admin@localhost",
        "activated": true,
        "langKey": "en",
        "imageUrl": "",
        "resetDate": null
    }
}];


export const DataProducts = [
    {
        id: 1,
        title: 'Muesli Croustilles',
        subtitle: 'By Coach Emy',
        image: require('../assets/images/prods/p1.png')
    },
    {
        id: 2,
        title: 'Breuvage Ventre Plat Et Détox',
        subtitle: 'Dégonflage Ventre',
        image: require('../assets/images/prods/p2.png')
    },
    {
        id: 3,
        title: 'Plats Diététiques',
        subtitle: 'Avec alliés minceurs',
        image: require('../assets/images/prods/p3.png')
    }

]
export const DataAstuces = [
    {
        id: 1,
        cat: 'Sekhmet',
        title: 'Manger au moins 5 fruits et legumes',
        subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry hey hey hey hey hey',
        image: require('../assets/images/prods/p4.png')
    },
]

export interface IChatMember {
    id?: string;
    scope?: ChatMemberScope;
    chat?: IChat | null;
}
export interface IChat {
    id?: string;
    icon?: string | null;
    name?: string | null;
    members?: IChatMember[] | null;
    messsages?: IMessage[] | null;
    chatType?: ChatType | null;
    createdBy?: string;
    createdDate?: Date | null;
    lastModifiedBy?: string;
    lastModifiedDate?: Date | null;
}
export interface IMessage {
    id?: string;
    text?: string | null;
    createdAt?: string | null;
    image?: string | null;
    video?: string | null;
    file?: string | null;
    audio?: string | null;
    contentTypeMedia?: string | null;
    system?: boolean | null;
    sent?: boolean | null;
    received?: boolean | null;
    pending?: boolean | null;
    read?: boolean | null;
    chat?: IChat | null;
    user?: IUser | null;
    replyToMessageID?: string | null;
}

export const defaultValue: Readonly<IMessage> = {
    system: false,
    sent: false,
    received: false,
    pending: false,
};


export enum TWILIO_ROLE {
    CHANNEL_USER = 'CHANNEL_USER',
    CHANNEL_ADMIN = 'CHANNEL_ADMIN'
}
