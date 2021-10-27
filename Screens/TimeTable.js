import React from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../Components/AppHeader';

export default class TimeTable extends React.Component {

    render(){
        return(
            <View>
                <AppHeader title = "Time Table"/>
                <Text>TimeTable</Text>
            </View>
        )
    }

}