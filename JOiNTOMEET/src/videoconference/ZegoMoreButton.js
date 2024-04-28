import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native"

export default function ZegoMoreButton(props) {
    const { onPress } = props;

    return (<View>
        <TouchableOpacity
            onPress={onPress}>
            <Text>More</Text>
        </TouchableOpacity>
    </View>)
}