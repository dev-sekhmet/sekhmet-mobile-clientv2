import {useEffect, useState} from 'react';
import api from "../tech/api";
import {IUser} from "../shared/user.model";
const useAccount = () => {
    const [account, setAccount] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCoach, setIsCoach] = useState(false);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await api.get('/account');
                setAccount(response.data);
                setIsAuthenticated(true);

                // Update isAdmin and isCoach based on the user's authorities
                if (response.data.authorities) {
                    setIsAdmin(response.data.authorities.includes('ROLE_ADMIN'));
                    setIsCoach(response.data.authorities.includes('ROLE_COACH'));
                }

            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    setIsAuthenticated(false);
                }
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, []);

    return {account, isAuthenticated, error, loading, isAdmin, isCoach};
}


export default useAccount;
