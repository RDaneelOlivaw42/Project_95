import React from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AppHeader from "../Components/AppHeader";
import app from "../config";
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Input } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';
import { Timestamp } from "firebase/firestore/lite";

export default class FormScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            className: '',
            classDate: '',
            classTiming: '',
            otherDetails: '',
            userId: ''
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
                })

                console.log(this.state.userId)
            }
        });
    }


    scheduleClass = () => {

        if( !this.state.className || !this.state.classDate || !this.state.classTiming ){
            return alert("Insufficient data to schedule class. Fill all the fields, then schedule.");
        }
        else{
            const db = getFirestore(app);

            try{

                const classDoc = addDoc( collection(db, "Scheduled Classes"), {
                    user_id: this.state.userId,
                    class_name: this.state.className,
                    class_date: this.state.classDate,
                    class_timing: this.state.classTiming,
                    other_details: this.state.otherDetails
                });

                return alert("Class Scheduled")

            }
            catch(error){
                console.log("Error in Firestore: " + error);
            };
        }

    }


    render(){
        return(
            <View>
                <AppHeader title = "Schedule Class" />

                <Text>FormScreen</Text>

                <View>
                    
                    <TextInput
                        placeholder = {'Class Name'}
                        onChangeText = { (text)=>{
                            this.setState({
                                className: text
                            })
                        }} 
                        value = {this.state.className}
                    />

                    <TextInputMask 
                        placeholder = {'Class Date'}
                        type = {'datetime'}
                        options = {{
                            format: 'DD/MM/YYYY'
                        }}
                        value = {this.state.classDate}
                        onChangeText = { (text)=>{
                            this.setState({
                                classDate: text
                            })
                        }}
                    />

                    <TextInput 
                        placeholder = {'In 24-hour clock format'}
                        onChangeText = { (text)=>{
                            this.setState({
                                classTiming: text
                            })
                        }}
                        keyboardType = 'numbers-and-punctuation'
                        value = {this.state.classTiming}
                    />

                    <TextInput 
                        placeholder = {'Other necessary details for the class'}
                        onChangeText = { (text)=>{
                            this.setState({
                                otherDetails: text
                            })
                        }}
                        value = {this.state.otherDetails}
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