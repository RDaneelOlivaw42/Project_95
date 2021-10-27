import React from "react";
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TimeTable from "../Screens/TimeTable";
import FormScreen from "../Screens/FormScreen";
import { StackNavigator } from "./StackNavigator";


export const TabNavigator = createBottomTabNavigator({

    TimeTable: {
        screen: StackNavigator,
        navigationOptions: {
            tabBarIcon: ( <Image /> ),
            tabBarLabel: "Time Table"
        }
    },

    FormScreen: {
        screen: FormScreen, 
        navigationOptions: {
            tabBarIcon: ( <Image /> ),
            tabBarLabel: "Schedule Class"
        }
    }

});