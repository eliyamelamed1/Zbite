import * as React from 'react';

import { Text, View } from 'react-native';

type PropsType = {
    navigation: {
        navigate: (path: string) => void;
    };
};
export default function AddRecipeScreen({ navigation }: PropsType) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => navigation.navigate('Home')} style={{ fontSize: 26, fontWeight: 'bold' }}>
                Settings Screen
            </Text>
        </View>
    );
}