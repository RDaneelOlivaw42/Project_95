import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppHeader from '../Components/AppHeader';
import app from '../config';
import { getFirestore, getDocs, collection, query, addDoc, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';
moment().format();


export default class NotificationsScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userId: '',
            classesData: [],
            willTheyCome : ''
        }
    }


    componentDidMount(){
        this.getUserId();
        this.fetchClassesData();
    }


    componentWillUnmount(){
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
            user_id: this.state.userId
        });
    }


    render(){
        return(
            <View>

                <AppHeader title = "Notifications" />
                
                <Text>NotificationsScreen</Text>

                <TouchableOpacity onPress = {()=>{
                    this.fetchClassesData();   
                }}>
                    <Text>Run this.fetchClassesData()</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {()=>{
                    this.checkToSendNotification();
                }}>
                    <Text>Run this.checkToSendNotification()</Text>
                </TouchableOpacity>

            </View>
        )
    }

}