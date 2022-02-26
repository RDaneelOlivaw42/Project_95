import React from "react";
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TimeTable from "../Screens/TimeTable";
import FormScreen from "../Screens/FormScreen";
import { StackNavigator } from "./StackNavigator";
import { NavigationContainer } from 'react-navigation';


export const TabNavigator = createBottomTabNavigator({

    TimeTable: {
        screen: StackNavigator,
        navigationOptions: {
            tabBarIcon: ( <Image source = { require('../assets/time_table.jpg') } style = {{ width: 30, height: 30 }} /> ),
            tabBarLabel: "Time Table",
        }
    },

    FormScreen: {
        screen: FormScreen, 
        navigationOptions: {
            tabBarIcon: ( <Image source = { require('../assets/schedule_class.jpg') } style = {{ width: 30, height: 30 }} /> ),
            tabBarLabel: "Schedule Class"
        }
    }

});