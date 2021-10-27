import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { TabNavigator } from './Components/TabNavigator';
import LoginScreen from './Screens/LoginScreen';
import { DrawerNavigator } from './Components/DrawerNavigator';


export default class App extends React.Component {

  render(){
    return(
      <AppContainer />
    )
  }

}

const SwitchNavigator = createSwitchNavigator({
  LoginScreen: { screen: LoginScreen },
  TabNavigator: { screen: TabNavigator },
  DrawerNavigator: { screen: DrawerNavigator }
})

const AppContainer = createAppContainer(SwitchNavigator);