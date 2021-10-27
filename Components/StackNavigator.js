import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import TimeTable from '../Screens/TimeTable';
import ClassDetailsScreen from '../Screens/ClassDetailsScreen';


export const StackNavigator = createStackNavigator({

    TimeTable: {
        screen: TimeTable,
        navigationOptions: {
            headerShown: false
        }
    },

    ClassDetailsScreen: {
        screen: ClassDetailsScreen,
        navigationOptions: {
            headerShown: false
        }
    }

},

    { initialRouteName: 'TimeTable' }

);