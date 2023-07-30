// CustomPrompt.tsx
import React, { useState } from 'react';
import { Modal, TextInput, StyleSheet } from 'react-native';
import {View, Text} from "./Themed";
import Colors from "../constants/Colors";
import {Button} from "react-native-paper";

interface Props {
    isVisible: boolean;
    title: string;
    placeholder?: string;
    onCancelLabel?: string;
    onSubmitLabel?: string;
    message: string;
    onCancel: () => void;
    onSubmit: (value: string) => void;
}

const AlertPrompt: React.FC<Props> = ({
                                          isVisible,
                                          title,
                                          placeholder,
                                          message,
                                          onCancel,
                                          onCancelLabel,
                                          onSubmit,
                                          onSubmitLabel
}) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{title}</Text>
                    <Text>{message}</Text>
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        placeholder={placeholder ?? ''}
                        style={styles.input}
                    />
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={onCancel} buttonColor={Colors.light.sekhmetOrange}>
                            {onCancelLabel ?? "Annuler"}
                        </Button>
                        <Button mode="contained" onPress={() => onSubmit(inputValue)} buttonColor={Colors.light.sekhmetGreen}>
                            {onSubmitLabel ?? "Valider"}
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default AlertPrompt
