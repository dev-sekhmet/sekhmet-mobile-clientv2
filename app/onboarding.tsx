import * as React from 'react';
import {View} from "../components/Themed";
import {OnboardingComponent} from "../components/onboarding/OnboardingComponent";


const OnBoardingScreen = React.memo(() => {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <OnboardingComponent/>
        </View>
    );
});
export default OnBoardingScreen;
