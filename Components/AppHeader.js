import React from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DrawerActions } from 'react-navigation-drawer';
import { withNavigation } from 'react-navigation';
import app from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, query, collection, where, limit, getDocs } from 'firebase/firestore'

class AppHeader extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userId: '',
            value: 0
        }
    }


    componentDidMount(){
        this.getUserId()
        this.fetchNotifications();
    }


    getUserId = () => {
        var auth = getAuth(app);

        onAuthStateChanged( auth, (user)=>{
            if(user){
                const userId = user.email

                this.setState({
                    userId: userId
                });
            }
        });
    }


    fetchNotifications = async () => {
        const db = getFirestore(app)
        var userId = this.state.userId

        const q = query( collection(db, 'All Notifications'), where('user_id','==',userId), where('mark_as_read','==',false) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){
            querySnapshot.forEach( (doc)=>{

                var notificationsData = querySnapshot.docs.map( document => document.data() )
                var notificationNumber = notificationsData.length
                this.setState({
                    value: notificationNumber
                })

            })
        }
        else{
            console.log("No Notifications")
        }
    }


    BellIconWithBadge = () => {
        
        if( this.state.value === 0 ){
            return(
                <SafeAreaProvider>

                    <Icon type = 'font-awesome' name = 'bell' size = {30} 
                          onPress = {()=>{ this.props.navigation.navigate('NotificationsScreen') }} />

                </SafeAreaProvider>
            )
        }
        else{
            return(
                <SafeAreaProvider>
                    <Icon type = 'font-awesome' name = 'bell' size = {30} 
                          onPress = {()=>{ this.props.navigation.navigate('NotificationsScreen') }} />
    
                    <Badge 
                        value = {this.state.value}
                        status = "error"
                        containerStyle = {{ position: 'absolute', top: 1, right: 2 }}
                    />
                </SafeAreaProvider>
            )
        }

    }


    render(){
        this.fetchNotifications()
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