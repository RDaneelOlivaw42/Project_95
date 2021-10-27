import React from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../Components/AppHeader';

export default class SettingsScreen extends React.Component {

    render(){
        return(
            <View>
                <AppHeader title = "Settings" />
                <Text>SettingsScreen</Text>
            </View>
        )
    }

}