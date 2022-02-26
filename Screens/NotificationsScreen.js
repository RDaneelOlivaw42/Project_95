import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import AppHeader from '../Components/AppHeader';
import app from '../config';
import { getFirestore, getDocs, collection, query, addDoc, where, updateDoc, doc, limit } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';
moment().format();


export default class NotificationsScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userId: '',
            classesData: [],
            notificationsData: [],
            runFetchClassesData: 0,
            runCheckToSendNotification: 0,
            runFetchNotifications: 0
        }
    }


    componentDidMount(){
        this.getUserId();
        this.fetchClassesData();
        this.checkToSendNotification();
    }


    componentDidUpdate(){
        if( this.state.runFetchNotifications === 0 ){
            this.fetchNotifications()
        }

        if( this.state.runFetchClassesData === 0 ){
            this.fetchClassesData()
        }
        
        if( this.state.runCheckToSendNotification === 0 ){
            this.checkToSendNotification()
        }
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


    fetchClassesData = async () => {
        const db = getFirestore(app);
        var userId = this.state.userId;

        const q = query( collection(db, 'Scheduled Classes'), where('user_id','==',userId) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){
            querySnapshot.forEach( (doc)=>{

                var updatedClassesData = querySnapshot.docs.map( document => document.data() )
                this.setState({
                    classesData: updatedClassesData,
                    runFetchClassesData: 1
                })

            })

        }
        else{
            console.log("No classes scheduled, aparently");
        }

    }


    checkToSendNotification = () => {
        var data = this.state.classesData
        var length = data.length
        var x;

        if( length !== 0 ){

            for( x = 0; x < length; x++ ){

                var classItem = data[x]

                var classHour = moment( classItem.class_starting_timing ).hour()
                var currentHour = moment().hour()
                var hourBeforeClassHour = moment( classItem.class_starting_timing ).subtract(1, 'hour').hour()

                var classMinutes = moment( classItem.class_starting_timing ).minute()
                var currentMinute = moment().minute()
                var FifteenMinutesBeforeClassMin = moment( classItem.class_starting_timing ).subtract(15, 'minutes').minute()
                var FifteenMinutesBeforeClassHr = moment( classItem.class_starting_timing ).subtract(15, 'minutes').hour()

                var classDay = moment( classItem.class_starting_timing ).day()
                var currentDay = moment().day()
                var timeLeft

                if( classHour === currentHour && classMinutes === currentMinute && classDay === currentDay ){
                    timeLeft = "Class Now"
                    this.sendNotification(classItem, timeLeft);
                }
                else if( hourBeforeClassHour === currentHour && classMinutes === currentMinute && classDay === currentDay ){
                    timeLeft = "1 hour left"
                    this.sendNotification(classItem, timeLeft);
                }
                else if( FifteenMinutesBeforeClassHr === currentHour && FifteenMinutesBeforeClassMin === currentMinute && classDay === currentDay ){
                    timeLeft = "15 minutes left"
                    this.sendNotification(classItem, timeLeft);
                }
                else{
                    continue;
                }


            }

        }
        else{

        }

        this.setState({
            runCheckToSendNotification: 1
        })

    }


    sendNotification = async ( classItem, timeLeft ) => {
        const db = getFirestore(app)

        const refDoc = await addDoc( collection(db, 'All Notifications'), {
            class_name: classItem.class_name,
            class_time: classItem.class_starting_timing,
            message: "You have " + classItem.class_name + " class at " + classItem.class_starting_timing,
            time_left: timeLeft,
            user_id: this.state.userId,
            mark_as_read: false
        });
    }


    fetchNotifications = async () => {
        const db = getFirestore(app)
        var userId = this.state.userId
        
        const q = query( collection(db, 'All Notifications'), where('user_id','==',userId), where('mark_as_read','==',false) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){
            querySnapshot.forEach( (doc)=>{

                var updatedNotificationsData = querySnapshot.docs.map( document => document.data() )
                this.setState({
                    notificationsData: updatedNotificationsData
                })

            })
        }
        else{
            console.log("No notifications")
        }

        this.setState({
            runFetchNotifications: 1
        })
    }


    markNotificationAsRead = async (notification) => {
        const db = getFirestore(app);
        var className = notification.class_name
        var classTime = notification.class_time
        var message = notification.message
        var timeLeft = notification.time_left
        var userId = notification.user_id

        const q = query( collection(db, 'All Notifications'), where('class_name','==',className), where('class_time','==',classTime), 
        where('message','==',message), where('time_left','==',timeLeft), where('user_id','==',userId), limit(1) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){
            querySnapshot.forEach( (document)=>{
                var docId = document.id

                const documentReference = doc(db, 'All Notifications', docId)
                updateDoc( documentReference, {
                    mark_as_read: true
                })

                return alert("Notification marked as 'read'")
            })
        }
        else{

        }
    }


    keyExtractor = (item, index) => index.toString()


    renderItem = ({ i, item }) => {
        return(
            <ListItem.Swipeable 

                leftContent = {
                    <View style = {styles.centreAlign}>
                       <TouchableOpacity  
                            style = {styles.leftContent}
                            onPress = {()=>{
                                this.markNotificationAsRead(item)
                            }}>

                                <View style = {styles.centreAlign}>
                                   <Text>
                                       <Text style = {styles.swipeText}>Mark as read  </Text>
                                       <Icon type = 'font-awesome' name = 'check-circle' color = '#F1DCC9' size = {30}  />
                                    </Text>
                                </View>

                        </TouchableOpacity>
                    </View>
                }

                rightContent = {
                    <View style = {styles.centreAlign}>
                        <TouchableOpacity 
                            style = {styles.rightContent}
                            onPress = {()=>{
                                this.markNotificationAsRead(item)
                            }}>

                               <View style = {styles.centreAlign}>
                                   <Text>
                                       <Text style = {styles.swipeText}>Mark as read  </Text>
                                       <Icon type = 'font-awesome' name = 'check-circle' color = '#F1DCC9' size = {30}  />
                                    </Text>
                                </View>

                        </TouchableOpacity>
                    </View>
                }>

                <ListItem.Content style = {styles.listItemContainer}>

                    <View>
                        <Icon name = 'envelope' type = 'font-awesome-5' color = '#F1DCC9' size = {30} />
                    </View>

                    <View style = {{ marginLeft: '1.2%' }}> 
                        <ListItem.Title style = {styles.listItemTitle}>{item.class_name}</ListItem.Title>
                        <ListItem.Subtitle style = {styles.listItemSubtitle}>{item.message}</ListItem.Subtitle>
                    </View>

                </ListItem.Content>

            </ListItem.Swipeable>
        )
    }


    render(){
        return(
            <View>
            <AppHeader title = "Notifications" />


            {
                this.state.notificationsData.length === 0 ?
                (
                    <View style = {styles.nullNotificationsContainer}>
                        <Text style = {{ fontFamily: 'Lora', fontSize: 17 }}>You have no notifications</Text>
                    </View>
                )
                : (
                    <View style = {{ marginLeft: '3%', marginTop: '0.6%', marginRight: '3%' }}>

                        <View>
                            <Text>
                            <Text style = {{ fontFamily: 'Lora', fontSize: 17 }}>Notifications </Text>
                            <Icon name = 'sort-desc' type = 'font-awesome' color = '#696969' size = {35} />
                            </Text>
                        </View>

                        <FlatList 
                            data = {this.state.notificationsData}
                            renderItem = {this.renderItem}
                            keyExtractor = {this.keyExtractor}
                            scrollEnabled = {true}
                        />

                    </View>
                )
            }
            </View>
        )
    }

}

const styles = StyleSheet.create({

    centreAlign: {
        flex: 1, 
        justifyContent: 'center'
    },

    leftContent: {
        alignItems: 'flex-start', 
        backgroundColor: '#021C1E', 
        paddingLeft: '5%', 
        minHeight: '68%'
    },

    rightContent: {
        alignItems: 'flex-end', 
        backgroundColor: '#021C1E', 
        paddingRight: '5%', 
        minHeight: '68%'
    },

    swipeText: {
        fontFamily: 'Lora', 
        color: '#F1DCC9', 
        fontSize: 17
    },

    listItemContainer: {
        backgroundColor: 'rgba(44, 120, 115, 0.7)', 
        paddingVertical: 13, 
        paddingHorizontal: 15, 
        flex: 2, 
        flexDirection: 'row', 
        justifyContent: 'flex-start'
    },

    listItemTitle: {
        fontFamily: 'Lora', 
        fontWeight: 'bold', 
        color: '#021C1E', 
        fontSize: 18 
    },

    listItemSubtitle: {
        fontFamily: 'Lora', 
        color: 'rgba(2, 28, 30, 0.6)'
    },

    nullNotificationsContainer: {
        marginLeft: '3%', 
        marginTop: '1.5%'
    }

})