import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppHeader from '../Components/AppHeader';
import moment from 'moment';
import app from '../config';
import { getFirestore, deleteDoc, collection, where, query, addDoc } from 'firebase/firestore';
moment().format();

export default class ClassDetailsScreen extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            classStartTime: this.props.navigation.getParam("data")["class_starting_timing"],
            classEndTime: this.props.navigation.getParam("data")["class_ending_timing"],
            classDate: this.props.navigation.getParam("data")["class_date"],
            otherDetails: this.props.navigation.getParam("data")["other_details"],
            userId: this.props.navigation.getParam("data")["user_id"],
            className: this.props.navigation.getParam("data")["class_name"]
        }
    }


    returnDate = () => {
        var date = moment( this.state.classDate ).format( 'DD-MM-YYYY');
        return date;
    }


    returnClassStartTime = () => {
        var classStartTime = moment( this.state.classStartTime ).format( 'HH:mm' );
        return classStartTime;
    }


    returnClassEndTime = () => {
        var classEndTime = moment( this.state.classEndTime ).format( 'HH:mm' );
        return classEndTime;
    }


    returnClassDuration = () => {
        var classStartTimeHr = moment( this.state.classStartTime ).hour()
        var classStartTimeMin = moment( this.state.classStartTime ).minute()
        var classEndTimeHr = moment( this.state.classEndTime ).hour()
        var classEndTimeMin = moment( this.state.classEndTime ).minute()

        var durationMinute = classEndTimeMin - classStartTimeMin;
        var durationHour = classEndTimeHr - classStartTimeHr;
        var duration = durationHour + ":" + durationMinute;
        return duration;
    }

//IDK but there's an error somewhere in this function - most likely
    deleteClass = async () => {
        const db = getFirestore(app);
        const documentReference = query( collection(db, "Scheduled Classes"), where('class_name','==',this.state.className), where('class_starting_timing','==',this.state.classStartTime),
        where('class_ending_timing','==',this.state.classEndTime), where('other_details','==',this.state.otherDetails), where('user_id','==',this.state.userId), where('class_date','==',this.state.classDate) )

        const refDoc = await deleteDoc(documentReference);

        return alert("Class has been cancelled.")
    }


    classAttended = async () => {
        const db = getFirestore(app);

        //adding document to 'Completed Classes'
        const document = addDoc( collection(db, 'Completed Classes'), {
            user_id: this.state.userId,
            class_name: this.state.className,
            class_date: this.state.classDate,
            class_starting_timing: this.state.classStartTime,
            class_ending_timing: this.state.classEndTime,
            other_details: this.state.otherDetails
        });

        //deleting document from 'Scheduled Classes'
        const documentReference = query( collection(db, "Scheduled Classes"), where('class_name','==',this.state.className), where('class_starting_timing','==',this.state.classStartTime),
        where('class_ending_timing','==',this.state.classEndTime), where('other_details','==',this.state.otherDetails), where('user_id','==',this.state.userId), where('class_date','==',this.state.classDate) )

        const refDoc = await deleteDoc(documentReference);

        return alert("Class has been marked as Attended")
    }


    render(){
        return(
            <View>
                <AppHeader title = "Class Details" />

                <Text>Name of Class: {this.state.className}</Text>
                <Text>Date of Class: {this.state.classDate}</Text>
                <Text>Class Starts at: {this.returnClassStartTime()}</Text>
                <Text>Class Ends at: {this.returnClassEndTime()}</Text>
                <Text>Class Duration: {this.returnClassDuration()}</Text>
                <Text>Other Details: {this.state.otherDetails}</Text>

                <TouchableOpacity onPress = {()=>{
                    this.deleteClass();
                }}>
                    <Text>Cancel Class</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {()=>{
                    this.classAttended();
                }}>
                    <Text>Attended Class</Text>
                </TouchableOpacity>

            </View>
        )
    }

}