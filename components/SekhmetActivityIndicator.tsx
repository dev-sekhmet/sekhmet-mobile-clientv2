import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {View} from "./Themed";
import Layout from "../constants/Layout";

const SekhmetActivityIndicator = (props: any) => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator style={props.style? props.style : styles.loading} size={props.size? props.size :'large'} color={Colors.light.sekhmetGreen}/>
    </View>
);


const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default SekhmetActivityIndicator;
