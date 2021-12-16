import { createContext } from 'react';


export type UserContextType = {
    name: string | null | undefined;
    guid: string | null | undefined;
    avatar: string | null | undefined;
    admin: boolean | null | undefined;
};

const INITIALUSER = {
    name: null,
    guid: null,
    avatar: null,
    admin: null
};
export const AuthProvider = createContext<UserContextType>(INITIALUSER);
