import React from "react";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../Screens/SettingsScreen";
import { TabNavigator } from './TabNavigator';


export const DrawerNavigator = createDrawerNavigator({

    SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
            drawerIcon: (
                <Icon />
            ),
            drawerLabel: "Settings"
        }
    },

    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: {
            drawerIcon: (
                <Icon />
            ),
            drawerLabel: "Home"
        }
    }

},

    { contentComponent: CustomSideBarMenu },
    { initialRouteName: 'TabNavigator' }
    
);