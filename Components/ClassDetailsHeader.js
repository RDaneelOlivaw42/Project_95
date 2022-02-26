import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withNavigation } from 'react-navigation';


class ClassDetailsHeader extends React.Component {

    render(){
        return(
            <SafeAreaProvider>
                <Header 
                    backgroundColor = '#2C4A52'
                    style = {{ padding: 20 }}

                    leftComponent = {
                        <Icon
                          type = 'font-awesome'
                          name = 'chevron-left'
                          style = {{ paddingLeft: 15, paddingTop: 6 }} 
                          onPress = { ()=>{
                              this.props.navigation.goBack()
                          }}
                          color = {'#F4EBDB'}
                        />
                    }

                    centerComponent = {{
                        text: this.props.title,
                        style: { fontSize: 30, textAlign: 'center', color: '#F4EBDB', fontFamily: 'Lora-Regular' }
                    }}
                />
            </SafeAreaProvider>
        )
    }

}

export default withNavigation(ClassDetailsHeader);