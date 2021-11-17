import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Touchable } from 'react-native';
import { ListItem } from 'react-native-elements';
import AppHeader from '../Components/AppHeader';
import app from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
moment().format();


const days = [
    {
        title: "  ",
        id: "0"
    },
    {
        title: "Monday",
        id: "1"
    },
    {
        title: "Tuesday",
        id: "2"
    },
    {
        title: "Wednesday",
        id: "3"
    },
    {
        title: "Thursday",
        id: "4"
    },
    {
        title: "Friday",
        id: "5"
    },
    {
        title: "Saturday",
        id: "6"
    },
    {
        title: "Sunday",
        id: "7"
    }
]


export default class TimeTable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userId: '',
            classesData: []
        }
    }


    componentDidMount(){
        this.getUserId();
        this.fetchClassesData()
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


    fetchClassesData = async () => {
        const db = getFirestore(app);
        var userId = this.state.userId

        const q = query( collection(db, "Scheduled Classes"), where('user_id','==',userId) )

        const querySnapshot = await getDocs(q)

        if(querySnapshot){
            querySnapshot.forEach((doc)=>{

                var updatedClassesData = querySnapshot.docs.map( document => document.data() )
                this.setState({
                    classesData: updatedClassesData
                })

            })
        }
        else{
            console.log("Somehow, this is empty");
        }

    }


    getVisibleHours = () => {
        var currentHour = moment().hour()
        var hourTwo = moment().add(1, 'hour').hour()
        var hourThree = moment().add(2, 'hour').hour()
        var hourFour = moment().add(3, 'hour').hour()
        var hourFive = moment().add(4, 'hour').hour()
        var hourSix = moment().add(5, 'hour').hour()
        var hourSeven = moment().add(6, 'hour').hour()
        var hourEight = moment().add(7, 'hour').hour()
        var hourNine = moment().add(8, 'hour').hour()

        var visibleHours = []
        visibleHours.push(currentHour, hourTwo, hourThree, hourFour, hourFive, hourSix, hourSeven, hourEight, hourNine);

        return visibleHours;
    }


    keyExtractor = (item, index) => index.toString()


    renderItemDays = ({ item, i }) => {
        return(
            <View style = {{ backgroundColor: 'yellow', width: '12.5%', borderColor: 'purple', borderWidth: 2 }}>
                <Text style = {{ alignSelf: 'center' }}>{item.title}</Text>
            </View>
        )
    }


    renderItemHours = ({ item }) => {
        return(
            <View style = {{ backgroundColor: 'green', borderWidth: 2, borderColor: 'black' }}>
                <Text>{item}</Text>
            </View>
        )
    }

    
    renderItemMonday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 1;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View style = {{ width: '100%', height: '100%' }}>
                    <TouchableOpacity
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen', { "data": classItem })
                    }}>
                        <Text>{ classTime }</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink', width: '100%', height: '100%' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemTuesday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 2;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemWednesday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 3;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemThursday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 4;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemFriday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 5;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemSaturday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 6;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }


    renderItemSunday = ({ item }) => {
        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 0;
        var length = classes.length

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classItem = classData
                }
                else{
                    continue;
                }

            }
            else{

                console.log("I am an idiot computer")
                continue;
                
            }

        }

        if( isClass === true ){
            return(
                <View>
                    <TouchableOpacity style = {{ width: '100%', height: '100%' }}
                    onPress = {()=>{
                        this.props.navigation.navigate('ClassDetailsScreen')
                    }}>
                        <Text>{ classItem.class_date }</Text>
                        <Text>HERE'S A CLASS</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return(
                <View style = {{ backgroundColor: 'red', borderWidth: 2, borderColor: 'pink' }}>
                    <Text style = {{ color: 'white' }}>{item}</Text>
                </View>
            )
        }
    }
 

    render(){
        return(
            <View style = {{ flex: 2 , height: '100%' }}>

                <View style = {{ height: '10%' , width: '100%' }}>
                    <AppHeader title = "Time Table" />
                    <TouchableOpacity onPress = {()=>{ this.fetchClassesData() }}>
                        <Text>Run fetchClassesData</Text>
                    </TouchableOpacity>
                </View>
                

                <View style = {{ height: '100%' }}>

                    <View style = {{ width: '100%' }}>

                        <FlatList 
                            data = {days}
                            renderItem = {this.renderItemDays}
                            keyExtractor = {this.keyExtractor}
                            numColumns = {8}
                        />

                    </View>

                    <View style = {{ flex: 7, flexDirection: 'row', height: '100%' }}>

                            <FlatList 
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemHours}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemMonday}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemTuesday}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemWednesday}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemThursday}
                                keyExtractor = {this.keyExtractor}
                            />

                           <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemFriday}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemSaturday}
                                keyExtractor = {this.keyExtractor}
                            />

                            <FlatList
                                data = {this.getVisibleHours()}
                                renderItem = {this.renderItemSunday}
                                keyExtractor = {this.keyExtractor}
                            />

                    </View>

                </View>

            </View>
        )
    }

}
// 7/1 % height for AppHeader view