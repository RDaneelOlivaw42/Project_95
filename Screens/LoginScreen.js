import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Modal, ScrollView, Touchable } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';      
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../config';


export default class LoginScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            firstName: '',
            lastName: '',
            emailID: '',
            password: '',
            confirmPassword: '',
            isModalVisible: false
        }
    }


    showModal = () => {
        return(
            <Modal
              animationType = 'fade'
              transparent = {true}
              visible = {this.state.isModalVisible}>
                  <View style = {{ margin: 100}}>

                      <ScrollView>
                          <KeyboardAvoidingView>

                              <TextInput 
                                  placeholder = {'First Name'}
                                  onChangeText = {(text)=>{
                                      this.setState({
                                          firstName: text
                                      })
                                  }}
                                  value = {this.state.firstName}
                              />

                              <TextInput 
                                  placeholder = {'Last Name'}
                                  onChangeText = {(text)=>{
                                      this.setState({
                                          lastName: text
                                      })
                                  }}
                                  value = {this.state.lastName}
                              />

                              <TextInput 
                                  placeholder = {'Email ID'}
                                  onChangeText = {(text)=>{
                                      this.setState({
                                          emailID: text
                                      })
                                  }}
                                  keyboardType = 'email-address'
                                  value = {this.state.emailID}
                              />

                              <TextInput 
                                  placeholder = {'Password'}
                                  onChangeText = {(text)=>{
                                      this.setState({
                                          password: text
                                      })
                                  }}
                                  secureTextEntry = {true}
                                  value = {this.state.password}
                              />

                              <TextInput 
                                  placeholder = {'Confirm Password'}
                                  onChangeText = {(text)=>{
                                      this.setState({
                                          confirmPassword: text
                                      })
                                  }}
                                  secureTextEntry = {true}
                                  value = {this.state.confirmPassword}
                              />  

                              <TouchableOpacity
                                onPress = {()=>{
                                    this.userSignUp(this.state.emailID, this.state.password);
                                    this.setState({
                                        isModalVisible: false
                                    });
                                    return alert("New user has been registered");
                                }}>
                                  <Text>Register</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress = {()=>{
                                    this.setState({
                                        isModalVisible: false
                                    })
                                }}>
                                  <Text>Cancel</Text>
                              </TouchableOpacity>

                          </KeyboardAvoidingView>
                      </ScrollView>

                  </View>
            </Modal>
        )
    }


    userSignUp = async (emailID, password) => {

        const db = getFirestore(app);
        const auth = getAuth(app);

        if(this.state.password !== this.state.confirmPassword){

            return alert("Password and Confirm Password do not match")
            
        }
        else{

            createUserWithEmailAndPassword(auth, emailID, password)
            .then( ()=>{

                try{
                    const userDoc = addDoc( collection(db, "users"), {
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                        email_id: this.state.emailID,
                        password: this.state.password
                    })

                    return console.log("Document ID: " + userDoc.id)
                }
                catch(error){
                    return console.log("Error in Firestore \n" + error)
                }

            })
            .catch( (error)=>{
                var errorCode = error.code
                var errorMessage = error.message
                return alert("Error in Authentication \n" + errorMessage)
            });

        }

    }


    userLogin = async (emailID, password) => {

        const auth = getAuth(app);
        
        signInWithEmailAndPassword(auth, emailID, password)
        .then( ()=>{
                    
        })
        .catch( (error)=>{
            var errorCode = error.code
            var errorMessage = error.message
            return alert(errorMessage)
        });

    }



    render(){
        return(
            <View>
                <Text>LoginScreen</Text>

                <View>
                    {this.showModal()}
                </View>

                <TextInput 
                  placeholder = {"Email ID"}
                  keyboardType = 'email-address'
                  autoFocus = {true}
                  onChangeText = { (text)=>{
                      this.setState({
                          emailID: text
                      })
                  }}
                />

                <TextInput 
                  placeholder = {"Password"}
                  secureTextEntry = {true}
                  onChangeText = { (text)=>{
                      this.setState({
                          password: text
                      })
                  }}
                />

                <TouchableOpacity
                  onPress = { ()=>{
                      this.userLogin(this.state.emailID, this.state.password);
                      this.props.navigation.navigate('TabNavigator'); 
                  }}>
                    <Text>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress = { ()=>{
                      this.setState({
                          isModalVisible: true
                      })
                  }}>
                    <Text>Sign up</Text>
                </TouchableOpacity>

            </View>
        )
    }

}