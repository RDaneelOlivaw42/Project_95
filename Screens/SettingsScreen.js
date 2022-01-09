import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AppHeader from '../Components/AppHeader';
import app from '../config';
import { getFirestore, collection, getDocs, where, query, limit, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

export default class SettingsScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            emailId: '',
            userDetails: '',
            docId: '',
            firstName: '',
            lastName: '',
            password: '',
            newPassword: '',
            changedFirstName: '',
            changedLastName: ''
        }
    }


    componentDidMount(){
        this.getUserId();
        this.fetchUserDetails();
    }


    getUserId = () => {
        var auth = getAuth(app);

        onAuthStateChanged( auth, (user)=>{
            if(user){
                const userId = user.email

                this.setState({
                    emailId: userId
                });
            }
        });
    }


    fetchUserDetails = async () => {
        var db = getFirestore(app);
        var userId = this.state.emailId

        const q = query( collection(db, 'users'), where('email_id','==',userId), limit(1) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){

            querySnapshot.forEach( (doc)=>{

                var fetchedDocId = doc.id
                var fetchedData = doc.data()
                this.setState({
                    docId: fetchedDocId,
                    userDetails: fetchedData,
                    firstName: fetchedData.first_name,
                    lastName: fetchedData.last_name,
                    password: fetchedData.password
                })
            
            })

        }
        else{

        }
    }


    reauthenticateAndChangePassword = () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        var userId = this.state.emailId
        var currentPassword = this.state.password
        var newPassword = this.state.newPassword

        const credential = EmailAuthProvider.credential(userId, currentPassword)

        if(newPassword){
            var errorMessageReauthenticate, errorCodeReauthenticate

            reauthenticateWithCredential( user, credential )
            .catch( (error)=>{
                errorMessageReauthenticate = error.message
                errorCodeReauthenticate = error.code
                alert(errorMessageReauthenticate)
            })
            .then( ()=>{

                if(errorMessageReauthenticate){

                }
                else{

                    var errorMessagePassword, errorCodePassword
    
                    updatePassword(user, newPassword)
                    .catch( (error)=>{
                        errorMessagePassword = error.message
                        errorCodePassword = error.code
                        alert(errorMessagePassword)
                    })
                    .then( ()=>{
                        if(errorMessagePassword){

                        } 
                        else{
                            return alert("Profile Changed Successfully")
                        }
                    })

                }
    
            })

        }
        else{
            return alert("Profile Changed Successfully")
        }

    }


    updateUserProfile = async () => {
        const db = getFirestore(app);
        var docId = this.state.docId;
        const documentReference = doc(db, "users", docId);
        var userId = this.state.emailId;
        var password, firstName, lastName;

        if( this.state.newPassword ){
            password = this.state.newPassword
        }
        else{
            password = this.state.password
        }

        if( this.state.changedFirstName ){
            firstName = this.state.changedFirstName
        }
        else{
            firstName = this.state.firstName
        }

        if( this.state.changedLastName ){
            lastName = this.state.changedLastName
        }
        else{
            lastName = this.state.lastName
        }

        await setDoc( documentReference, {
            first_name: firstName,
            last_name: lastName,
            password: password,
            email_id: userId
        });

    }


    deleteUser = async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        var errorMessage, errorCode

        deleteUser(user)
        .catch( (error)=>{
            errorMessage = error.message;
            errorCode = error.code;
            return alert(errorMessage);
        })
        .then( ()=>{
            if(!errorMessage){
                const db = getFirestore(app)
                var docId = this.state.docId

                deleteDoc( doc(db, "users", docId) )

                return alert("Deleted User")
            }
            else{

            }
        })

    }


    render(){
        var userDetails = this.fetchUserDetails()
        return(
            <View>
                <AppHeader title = "Settings" />
                <Text>SettingsScreen</Text>

                <TextInput 
                   placeholder = {this.state.firstName}
                   placeholderTextColor = {'#000'}
                   onChangeText = { (text)=>{
                       this.setState({
                           changedFirstName: text
                       })
                   }}
                />

                <TextInput
                   placeholder = {this.state.lastName}
                   placeholderTextColor = {'#000'}
                   onChangeText = { (text)=>{
                       this.setState({
                           changedLastName: text
                       })
                   }}
                />

                <TextInput 
                   placeholder = {this.state.password}
                   placeholderTextColor = {'#000'}
                   onChangeText = { (text)=>{
                       this.setState({
                           newPassword: text
                       })
                   }}
                />

                <TouchableOpacity onPress = {()=>{
                    this.reauthenticateAndChangePassword();
                    this.updateUserProfile();
                }}>
                    <Text>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {()=>{
                    this.deleteUser();
                }}>
                    <Text>Delete User</Text>
                </TouchableOpacity>

            </View>
        )
    }

}