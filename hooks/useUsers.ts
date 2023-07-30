import { useState, useEffect } from 'react';
import {fetchUsers} from "../tech/users.api";
import {IUser} from "../shared/user.model";

const DEFAULT_PAGEABLE = { page: 0, size: 10 };

const useUsers = (search = '', pageable = DEFAULT_PAGEABLE) => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const response = await fetchUsers(search, pageable);
                setUsers(response);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [search, pageable]);

    return { users, loading, error };
};

export default useUsers;
