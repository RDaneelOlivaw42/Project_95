import React from "react";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../Screens/SettingsScreen";
import NotificationsScreen from "../Screens/NotificationsScreen";
import { TabNavigator } from './TabNavigator';


export const DrawerNavigator = createDrawerNavigator({

    SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
            drawerIcon: (
                <Icon name = 'settings' type = 'fontawesome5' />
            ),
            drawerLabel: "Settings"
        }
    },

    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: {
            drawerIcon: (
                <Icon name = 'home' type = 'fontawesome5' />
            ),
            drawerLabel: "Home"
        }
    },

    NotificationsScreen: {
        screen: NotificationsScreen,
        navigationOptions: {
            drawerIcon: (
                <Icon name = 'bell' type = 'font-awesome' />
            ),
            drawerLabel: "Notifications"
        }
    }

},

    { contentComponent: CustomSideBarMenu },
    { initialRouteName: 'TabNavigator' }
    
);