import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import ClassDetailsHeader from '../Components/ClassDetailsHeader';
import moment from 'moment';
import app from '../config';
import { getFirestore, deleteDoc, collection, where, query, addDoc, getDocs, limit, doc } from 'firebase/firestore';
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
        var displayMinute, displayHour

        if( durationMinute === 0 ){
            displayMinute = ''
        }
        else if( durationMinute === 1 ){
            displayMinute = durationMinute + " minute"
        }
        else{
            displayMinute = durationMinute + " minutes"
        }

        if( durationHour === 0 ){
            displayHour = ''
        }
        else if( durationHour === 1 ){
            displayHour = durationHour + " hour "
        }
        else{
            displayHour = durationHour + " hours "
        }

        var duration = displayHour + displayMinute;
        return duration;
    }


    deleteClass = async () => {
        const db = getFirestore(app)
        var docId

        const q = query( collection(db, "Scheduled Classes"), where('user_id','==',this.state.userId), where('class_name','==',this.state.className), where('class_date','==',this.state.classDate), where('class_starting_timing','==',this.state.classStartTime),
        where('class_ending_timing','==',this.state.classEndTime), where('other_details','==',this.state.otherDetails), limit(1))

        const documentReference = await getDocs(q)

        if(documentReference){
            documentReference.forEach( async (doc)=>{

                var docIdArray = documentReference.docs.map( document => document.id )
                docId = docIdArray.toString()

            })
        }
        else{
            return alert("documentReference does not exist")
        }

        await deleteDoc( doc(db, "Scheduled Classes", docId) )

        return alert("Class has been cancelled")
    }


    classAttended = async () => {
        const db = getFirestore(app);
        var docId

       //adding document to 'Completed Classes'
        const document = addDoc( collection(db, 'Completed Classes'), {
            user_id: this.state.userId,
            class_name: this.state.className,
            class_date: this.state.classDate,
            class_starting_timing: this.state.classStartTime,
            class_ending_timing: this.state.classEndTime,
            other_details: this.state.otherDetails
        });

        //deleting document from Scheduled Classes
        const q = query( collection(db, "Scheduled Classes"), where('user_id','==',this.state.userId), where('class_name','==',this.state.className), where('class_date','==',this.state.classDate), where('class_starting_timing','==',this.state.classStartTime),
        where('class_ending_timing','==',this.state.classEndTime), where('other_details','==',this.state.otherDetails), limit(1))

        const documentReference = await getDocs(q)

        if(documentReference){
            documentReference.forEach( async (doc)=>{

                var docIdArray = documentReference.docs.map( document => document.id )
                docId = docIdArray.toString()

            })
        }
        else{
            return alert("Sod off")
        }

        await deleteDoc( doc(db, "Scheduled Classes", docId) )


        return alert("Class has been marked as attended")
    }


    render(){
        return(
            <View>
                <ClassDetailsHeader title = "Class Details" />

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