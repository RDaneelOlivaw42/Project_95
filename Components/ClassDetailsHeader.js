import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withNavigation } from 'react-navigation';


class ClassDetailsHeader extends React.Component {

    render(){
        return(
            <SafeAreaProvider>
                <Header 
                    backgroundColor = 'blue'

                    leftComponent = {
                        <Icon
                          type = 'font-awesome'
                          name = 'chevron-left'
                          style = {{ paddingLeft: 15, paddingTop: 10 }} 
                          onPress = { ()=>{
                              this.props.navigation.goBack()
                          }}
                        />
                    }

                    centerComponent = {{
                        text: this.props.title,
                        style: { fontSize: 30, textAlign: 'center' }
                    }}
                />
            </SafeAreaProvider>
        )
    }

}

export default withNavigation(ClassDetailsHeader);