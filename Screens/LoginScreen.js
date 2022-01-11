import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Modal, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateProfile, sendPasswordResetEmail } from 'firebase/auth';      
import { getFirestore, collection, addDoc, getDocs, where, limit, updateDoc, doc, query } from 'firebase/firestore';
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

                this.updateUserProfile()

                try{
                    const userDoc = addDoc( collection(db, "users"), {
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                        email_id: this.state.emailID,
                        password: this.state.password
                    })

                    return alert("New user has been registered");
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


    updateUserProfile = () => {
        const auth = getAuth(app);
        var name = this.state.firstName + " " + this.state.lastName

        updateProfile( auth.currentUser, {
            displayName: name
        })
        .then(()=>{
            console.log("added name to firebase auth")
        }) 
        .catch( (error)=>{
            var errorMessage = error.message
            var errorCode = error.code
            return alert(errorMessage)
        })
    }


    userLogin = async (emailID, password) => {
        var errorCode, errorMessage;

        const auth = getAuth(app);
        
        signInWithEmailAndPassword(auth, emailID, password)
        .catch( (error)=>{
            errorCode = error.code
            errorMessage = error.message
            return alert(errorMessage)
        })
        .then( async ()=>{
            if(errorMessage){

            }
            else{
                const db = getFirestore(app)
                const q = query( collection(db, 'users'), where('email_id','==',emailID), limit(1) )
                const querySnapshot = await getDocs(q)

                if(querySnapshot){
                    querySnapshot.forEach( (document)=>{

                        var firestorePassword = document.data().password
                        var docId = document.id

                        if(firestorePassword !== password){

                            updateDoc( doc(db, "users", docId), {
                                password: password
                            })

                        }

                    })
                }

                this.props.navigation.navigate('TabNavigator'); 
            }
        });

    }


    resetPassword = () => {
        const auth = getAuth(app);
        var userId = this.state.emailID

        sendPasswordResetEmail(auth, userId)
        .then( ()=>{
            return alert("Password-reset email sent")
        })
        .catch( (error)=>{
            var errorCode = error.code
            var errorMessage = error.message
            return alert(errorMessage)
        })
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

                <TouchableOpacity 
                  onPress = {()=>{
                      this.resetPassword()
                  }}>
                    <Text>Forgot Password?</Text>
                </TouchableOpacity>

            </View>
        )
    }

}