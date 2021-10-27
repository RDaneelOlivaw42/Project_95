import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DrawerActions } from 'react-navigation-drawer';
import { withNavigation } from 'react-navigation';

class AppHeader extends React.Component {

    constructor(props){
        super(props);

    }


    BellIconWithBadge = () => {
        return(
            <SafeAreaProvider>
                <Icon type = 'font-awesome' name = 'bell' size = {30} />
            </SafeAreaProvider>
        )
    }


    render(){
        return(
            <SafeAreaProvider>
                <Header 
                    backgroundColor = 'blue'

                    leftComponent = {
                        <Icon
                          type = 'font-awesome'
                          name = 'bars'
                          style = {{ paddingLeft: 15, paddingTop: 10 }} 
                          onPress = { ()=>{
                              this.props.navigation.dispatch(DrawerActions.toggleDrawer());
                          }}
                        />
                    }

                    rightComponent = { < this.BellIconWithBadge /> }

                    centerComponent = {{
                        text: this.props.title,
                        style: { fontSize: 30, textAlign: 'center' }
                    }}
                />
            </SafeAreaProvider>
        )
    }

}

export default withNavigation(AppHeader);