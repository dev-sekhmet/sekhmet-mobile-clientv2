import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import EditScreenInfo from '../../../../components/EditScreenInfo';
import {Text, View} from '../../../../components/Themed';
import * as React from "react";
import {DataAstuces, DataProducts} from "../../../../data/sampleData";
import ProductItem from "../../../../components/ProductItem";
import AstuceItem from "../../../../components/AstuceItem";
import {useEffect, useState} from "react";
import Layout from "../../../../constants/Layout";
import useAccount from "../../../../hooks/useAccount";
import SekhmetActivityIndicator from "../../../../components/SekhmetActivityIndicator";

export default function HomeScreen() {
    const [items, setItems] = useState([false, false]);
    const [isRefreshing, setRefresh] = useState(false);
    const {account, loading} = useAccount();

    if (loading) {
        return <SekhmetActivityIndicator />;
    }

    const homePart = [
        {id: 1, text: 'Nos produits Sekhmet', data: DataProducts},
        {id: 2, text: 'Conseils & Astuces de la semaine', data: DataAstuces},
    ]


    return (
            <View style={styles.container}>
                <SafeAreaView/>
                <FlatList refreshing={false} onRefresh={() => {
                }}
                          keyExtractor={(item: any) => item.id}
                          data={homePart}
                          contentContainerStyle={{alignContent: 'center', paddingHorizontal: 16}}
                          renderItem={({item, index}) => {
                              let parentIndex = index;
                              return <View style={{marginBottom: 12}}>

                                  <Text style={{
                                      textAlign: 'left',
                                      alignSelf: 'flex-start',
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                      marginBottom: 10,
                                      color: 'grey'
                                  }}>{item.text}</Text>
                                  <FlatList data={item.data}
                                            keyExtractor={(item: any) => item.id}
                                            renderItem={({item, index}) => (
                                                // {
                                                (index <= 1 || items[0])
                                                    ?
                                                    parentIndex == 0 ? <ProductItem navigation={null} item={item}
                                                                                    index={index}/> :
                                                        <AstuceItem navigation={null} item={item} index={index}/>
                                                    :
                                                    <TouchableOpacity style={{alignItems: 'center'}}
                                                                      onPress={() => parentIndex == 0 ? setItems([true, items[1]]) : setItems([items[0], true])}>
                                                        <Text style={{
                                                            textAlign: 'center',
                                                            color: '#62A01A',
                                                            fontStyle: 'italic'
                                                        }}>Voir
                                                            plus de produits...</Text>
                                                    </TouchableOpacity>
                                                // }
                                            )}/>
                              </View>
                          }
                          }/>
            </View>
    );
}
//For product listing


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    adminContainer: {
        flex: 1,
        backgroundColor: '#F9F8FD'
    },
    card: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: 'center',
        marginHorizontal: "2%",
        margin: 10,
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.57,
        shadowRadius: 0.19,
    },
    ajouterButton: {
        flex: 1,
        padding: 5,
        borderRadius: 10,
        maxHeight: Layout.window.height * 0.05,
        flexDirection: 'row', justifyContent: 'center',
        backgroundColor: "white",
        marginHorizontal: "2%",
        margin: 10,
        marginTop: 15,
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.57,
    },
    number: {
        marginTop: 10,
        fontSize: 20
    },
    fontCommon: {
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
    }
});
