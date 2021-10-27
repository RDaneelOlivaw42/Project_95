import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerItems } from 'react-navigation-drawer';
import { signOut, getAuth } from 'firebase/auth';
import app from '../config';


export default class CustomSideBarMenu extends React.Component {

    render(){
        return(
            <View style = {styles.container}>

                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>

                <View style = {styles.logOutContainer}>
                    <TouchableOpacity
                      style = {styles.logOutButton}
                      onPress = { ()=>{
                          const auth = getAuth(app);
                          signOut(auth);
                          this.props.navigation.navigate('LoginScreen');
                      }}>
                        <View style = {{ flex: 2, flexDirection: 'row' }}>

                            <View style = {{ paddingLeft: 10, paddingRight: 28 }}>
                                <Icon name = 'logout' type = 'antdesign' />
                            </View>
                            
                            <Text style = {styles.logOutText}>Logout</Text>

                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    drawerItemsContainer: {
        flex: 0.8
    },
    
    logOutContainer: {
        flex: 0.02,
        justifyContent: 'center',
        paddingBottom: 30
    },

    logOutButton: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },

    logOutText: {
        fontWeight: 'bold'
    }

})