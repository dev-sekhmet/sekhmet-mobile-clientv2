import { useState, useEffect } from 'react';
import {fetchUser} from "../tech/users.api";
import {IUser} from "../shared/user.model";

const useUser = (id: string) => {
    const [user, setUser] = useState<IUser>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                setLoading(true);
                const response = await fetchUser(id);
                setUser(response);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [id]);

    return { user, loading, error };
};

export default useUser;
