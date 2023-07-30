import {useEffect, useState} from 'react';
import api from "../tech/api";
import {IUser} from "../shared/user.model";

const useAccount = () => {
    const [account, setAccount] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await api.get('/account'); // make sure this is your correct account endpoint
                setAccount(response.data);
                setIsAuthenticated(true); // if request is successful, set isAuthenticated to true
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    // if the error response status is 401, set isAuthenticated to false
                    setIsAuthenticated(false);
                }
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, []);

    return {account, isAuthenticated, error, loading};
};

export default useAccount;
