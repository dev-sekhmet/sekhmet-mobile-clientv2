import {
    FlatList,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    ViewToken,
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    SharedValue,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

import { Button } from './Button';
import {Pagination, SlideData} from './Pagination';
import Colors from "../../constants/Colors";




const slides: SlideData[] = [
    {
        id: '1',
        image: require('../../assets/images/onboarding/011.png'),
        title: 'FAITES-VOUS SUIVRE PAR DES EXPERTS',
        text: 'Locate people you care about in real time, and see where they are, View directions on the map.',
    },
    {
        id: '2',
        image: require('../../assets/images/onboarding/022.png'),
        title: 'AU TRAVERS D’UNE ALIMENTATION SAINE',
        text: 'Know when they are in danger thanks to notifications (accident, illness, insecurity, etc.)',
    },
    {
        id: '3',
        image: require('../../assets/images/onboarding/033.png'),
        title: 'DES CONSEILS POUR GARDER LA FORME',
        text: 'See what your loved ones are doing. Discover what\'s happening around, and share your daily moments',
    },
];
const RenderItem = ({item,index,x}: { item: SlideData;index: number;x: SharedValue<number>; }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [0, 1, 0],
            Extrapolate.CLAMP
        );

        const translateYAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [100, 0, 100],
            Extrapolate.CLAMP
        );

        return {
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            opacity: opacityAnimation,
            transform: [{ translateY: translateYAnimation }],
        };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [0, 1, 0],
            Extrapolate.CLAMP
        );

        const translateYAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [100, 0, 100],
            Extrapolate.CLAMP
        );

        return {
            opacity: opacityAnimation,
            transform: [{ translateY: translateYAnimation }],
        };
    });

    return (
        <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
            <Animated.Image source={item.image} style={imageAnimatedStyle} />

            <Animated.View style={textAnimatedStyle}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemText}>{item.text}</Text>
            </Animated.View>
        </View>
    );
};

export function OnboardingComponent() {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const flatListRef = useAnimatedRef<FlatList>();

    const flatListIndex = useSharedValue(0);
    const x = useSharedValue(0);

    const onViewableItemsChanged = ({viewableItems,}: {
        viewableItems: Array<ViewToken>;
    }) => {
        flatListIndex.value = viewableItems[0].index ?? 0;
    };

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef as any}
                data={slides}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <RenderItem index={index} item={item} x={x} />
                )}
                onScroll={onScroll}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                pagingEnabled
                onViewableItemsChanged={onViewableItemsChanged}
            />

            <View style={styles.footerContainer}>
                <Pagination data={slides} screenWidth={SCREEN_WIDTH} x={x} />

                <Button
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                    dataLength={slides.length}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    itemTitle: {
        color: Colors.light.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    itemText: {
        color: Colors.light.text,
        textAlign: 'center',
        lineHeight: 20,
        marginHorizontal: 30,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 30,
    },
});
