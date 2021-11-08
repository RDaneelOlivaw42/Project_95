import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import AppHeader from "../Components/AppHeader";
import app from "../config";
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Input } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import { Timestamp } from "firebase/firestore/lite";
import moment from 'moment';
moment().format();


export default class FormScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            className: '',
            classDate: '',
            classStartingTiming: '',
            classEndingTiming: '',
            otherDetails: '',
            userId: '',
            isDateValid: false
        }
    }


    componentDidMount(){
        this.getUserId();
    }


    getUserId = () => {
        const auth = getAuth(app);

        onAuthStateChanged(auth, (user)=>{
            if(user){
                const userId = user.email

                this.setState({
                    userId: userId
                });
            }
        });
    }


    scheduleClass = () => {

        if( !this.state.className || !this.state.classDate || !this.state.classStartingTiming || !this.state.classEndingTiming ){
            return alert("Insufficient data to schedule class. Fill all the fields, then schedule.");
        }
        else{

            if(this.state.isDateValid === true){

                const db = getFirestore(app);

                var classDate = this.state.classDate;
                var classStartingTiming = this.state.classStartingTiming;
                var classEndingTiming = this.state.classEndingTiming;
        
                var classStart = classDate + " " + classStartingTiming
                var classEnd = classDate + " " + classEndingTiming
        
                var classStartMoment = moment(classStart, 'YYYY-MM-DD HH:mm').format();
                var classEndMoment = moment(classEnd, 'YYYY-MM-DD HH:mm').format();
                var classDateMoment = moment(classDate, 'YYYY-MM-DD').format();

                try{
    
                    const classDoc = addDoc( collection(db, "Scheduled Classes"), {
                        user_id: this.state.userId,
                        class_name: this.state.className,
                        class_date: classDateMoment,
                        class_starting_timing: classStartMoment,
                        class_ending_timing: classEndMoment,
                        other_details: this.state.otherDetails,
                    });
    
                    return alert("Class Scheduled")
    
                }
                catch(error){
                    console.log("Error in Firestore: " + error);
                }; 

            }
            else{
                return alert("Class Date is not valid");
            }

        }

    }


    checkIsClassDateValid = () => {
        var dateValid = this.classDate.isValid()

        this.setState({
            isDateValid: dateValid
        });
    }


    classDateField = () => {
        return(
            <TextInputMask 
                placeholder = {'YYYY-MM-DD'}
                type = {'datetime'}
                options = {{
                    format: 'YYYY-MM-DD'
                }}
                value = {this.state.classDate}
                onChangeText = { (text)=>{

                    this.setState({
                        classDate: text
                    })

                    this.checkIsClassDateValid();

                }}
                ref = { (ref) => this.classDate = ref }
            />
        )
    }

    
    classStartingTiming = () => {
        return(
            <TextInputMask
                placeholder = {'Hours:Minutes'}
                type = {'datetime'}
                options = {{
                    format: 'HH:mm'
                }}
                value = {this.state.classStartingTiming}
                onChangeText = { (text)=>{

                    this.setState({
                        classStartingTiming: text
                    })

                }}
            />
        )
    }


    classEndingTiming = () => {
        return(
            <TextInputMask
                placeholder = {'Hours:Minutes'}
                type = {'datetime'}
                options = {{
                    format: 'HH:mm'
                }}
                value = {this.state.classEndingTiming}
                onChangeText = { (text)=>{

                    this.setState({
                        classEndingTiming: text
                    })

                }}
            />
        )
    }


    render(){
        return(
            <View>
                <AppHeader title = "Schedule Class" />

                <View>

                    <Input 
                        placeholder = {'Class Name'}
                        onChangeText = {(text)=>{
                            this.setState({
                                className: text
                            })
                        }}
                        value = {this.state.className}
                        label = {'Class Name'}
                    />

                    <Input
                        label = {'Class Date'}
                        InputComponent = {this.classDateField}
                    />

                    <Input
                        label = {'Class Starts at (in 24-hour clock)'}
                        InputComponent = {this.classStartingTiming}
                    />

                    <Input
                        label = {'Class Ends at (in 24-hour clock)'}
                        InputComponent = {this.classEndingTiming}
                    />

                    <Input
                        placeholder = {'Other necessary details for the class'}
                        onChangeText = { (text)=>{
                            this.setState({
                                otherDetails: text
                            })
                        }}
                        value = {this.state.otherDetails}
                        label = {'Other details'}
                    />

                    <TouchableOpacity
                      onPress = {()=>{
                          this.scheduleClass();
                      }}>
                        <Text>Schedule Class</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }

}