import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
            ranFunction: 0
        }
    }


    componentDidMount(){
        this.getUserId();
        this.fetchClassesData();
        this.checkToSendNotification();
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
                    classesData: updatedClassesData
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
        
        const q = query( collection(db, 'All Notifications'), where('user_id','==',userId) )

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
        console.log(item)
        return(
            <ListItem key = {i} bottomDivider = {true}>
                <ListItem.Content style = {{ backgroundColor: 'yellow' }}>


                    <ListItem.Title>{item.class_name}</ListItem.Title>

                    <ListItem.Subtitle>{item.message}</ListItem.Subtitle>

                    <TouchableOpacity onPress = {()=>{
                        this.markNotificationAsRead(item)
                    }}>
                        <Text>Mark as read</Text>
                    </TouchableOpacity>

                </ListItem.Content>
            </ListItem>
        )
    }


    render(){
        return(
            <View>

                <AppHeader title = "Notifications" />
                
                <View>

                    <View>
                        {
                            this.state.ranFunction > 0 ?
                            (
                                this.state.notificationsData.length === 0 ?
                                (
                                    <View>
                                        <Text>You have no notifications</Text>
                                    </View>
                                )
                                : (
                                    <View>

                                        <View>
                                            <Text>
                                            <Text>Read Notifications</Text>
                                            <Icon name = 'sort-desc' type = 'font-awesome' color = '#696969' />
                                            </Text>
                                        </View>

                                        <FlatList 
                                            data = {this.state.notificationsData}
                                            renderItem = {this.renderItem}
                                            keyExtractor = {this.keyExtractor}
                                        />

                                    </View>
                                )
                            )
                            : (
                                <View>
        
                                    <TouchableOpacity
                                        onPress = {()=>{
                                            this.fetchClassesData()
                                            this.checkToSendNotification()
                                            this.fetchNotifications()
                                            this.setState({
                                                ranFunction: 1
                                            })
                                        }}>
                                            <View style = {{ display: 'flex', flex: 2, flexDirection: 'row' }}>
                                                <Text>Unread Notifications</Text>
                                                <Icon name = 'sort-up' type = 'font-awesome' color = '#696969'/>
                                            </View>
                                    </TouchableOpacity>
    
                                </View>
                            )
                        }
                    </View>

                </View>

            </View>
        )
    }

}