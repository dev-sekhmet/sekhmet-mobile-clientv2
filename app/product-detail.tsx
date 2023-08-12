import {Dimensions, FlatList, ImageBackground, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from '../components/Themed';
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {Button} from "react-native-paper";
import {useLocalSearchParams} from "expo-router";
import {Icon, ListItem} from "@rneui/themed";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
type CharacteristcItem = {
    id: number;
    text: string;
    icon: string;
};

export default function ProductDetail() {
    const {  product } = useLocalSearchParams();

    const characteristics: CharacteristcItem[] = [
        {
            id: 1,
            icon: 'check',
            text: 'Dégraisse Progressivement'
        }, {
            id: 2,
            icon: 'check',
            text: 'Baisse Le Taux De Glycémie'
        }, {
            id: 3,
            icon: 'check',
            text: 'Baisse La Tension'
        }, {
            id: 4,
            icon: 'check',
            text: 'Elimine Les Sensations De Faim'
        }, {
            id: 5,
            icon: 'check',
            text: 'Perte Assuré De Poids Sainement'
        }
    ];
    const RenderRow = ({item}: { item: CharacteristcItem }) => {
        return (
            <ListItem
                bottomDivider>
                <Icon color={Colors.light.sekhmetGreen} name={item.icon}/>
                <ListItem.Content>
                    <ListItem.Title>{item.text}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
    };
    return (
        <ScrollView className="container mx-auto px-4" style={{backgroundColor: 'white'}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
        <View style={{backgroundColor: 'white'}}>
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={[{fontSize: 16}, styles.title]}>{"Révélez La Meilleur Version De Vous Même"}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                        resizeMode="cover" source={require('../assets/images/prods/p1.png')}/>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: "center",
                borderRadius: 15,
                margin: 10,
                height: 200,
            }}>
                <View style={{
                    width: '45%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: 'lightgreen'
                }}>
                    <ImageBackground
                        style={{width: '100%', height: '100%', flex: 1, borderRadius: 12}}
                        resizeMode="cover" source={require('../assets/images/expo-muesli-croustilles.png')}/>
                </View>
                <View style={{
                    flexDirection: 'column',
                    width: '55%',
                    height: '100%',
                    margin: 10,
                    paddingTop: 20
                }}>
                    <Text style={[{fontSize: 16}, {
                        justifyContent: 'flex-start',
                        color: Colors.light.sekhmetGreen
                    }]}>{'Muesli Croustilles'}</Text>
                    <Text style={{
                        color: Colors.light.sekhmetOrange,
                        marginBottom: 10
                    }}>{'By coach Emy'}
                    </Text>

                    <Text>{'Long established fact that a reader will be distracted by the readable content of a page when looking at its'}</Text>
                </View>
            </View>

            <View>
                {
                    characteristics.map((item: CharacteristcItem)=> <RenderRow key={item.id} item={item} />
                    )
                }

            </View>

            <View style={{alignItems: 'center', marginTop: 30}}>
                <Button mode="contained"
                        style={{borderRadius: 20, width: width * 0.9}}
                        icon={'send'}
                        uppercase={false}
                        contentStyle={{flexDirection: 'row-reverse'}}
                        buttonColor={Colors.light.sekhmetGreen}>
                    Commander le produit
                </Button>
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        marginBottom: 10
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        borderRadius: 15,
        margin: 10,
        height: 150,
        backgroundColor: 'orangered'
    },
    imageContainer: {
        width: '40%',
        borderRadius: 12,
        overflow: 'hidden'
    },
    textContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 8
    }
});
