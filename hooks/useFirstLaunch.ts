import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LAUNCHED_KEY = 'APP_LAUNCHED_KEY'; // replace with your key

const useFirstLaunch = () => {
    const [isFirstLaunch, setFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        //AsyncStorage.removeItem(APP_LAUNCHED_KEY);
        AsyncStorage.getItem(APP_LAUNCHED_KEY).then((value) => {
            if (value === null) {
                AsyncStorage.setItem(APP_LAUNCHED_KEY, "false");
                setFirstLaunch(true);
            } else {
                setFirstLaunch(false);
            }
        });
    }, []);

    return isFirstLaunch;
};

export default useFirstLaunch;
