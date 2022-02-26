import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import AppHeader from '../Components/AppHeader';
import app from '../config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { useIntl } from 'react-intl';

moment().format();
var rain = 'rgba(44, 120, 115, 0.8)'
var cadetBlue = '#004445'
var blueBlack = '#021C1E'
var greenery = '#6FB98F'
var smog = '#F1DCC9'
var smogSubtitle = '#F1DCC9'
var periwinkle = '#F4EBDB'
var periwinkleSubtitle = '#D6CFC1'
var linen = '#EAE2D6'
var rainClass = '#4B908C'


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
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class TimeTable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userId: '',
            classesData: []
        }

        this.fetchClassesData();
    }


    componentDidMount(){
        this.getUserId();
    }


    componentDidUpdate(){
        if(this.state.classesData.length === 0){
            this.fetchClassesData()
        }
        else{

        }
    }



    getUserId = () => {
        const auth = getAuth(app);
        var userId

        onAuthStateChanged(auth, (user)=>{
            if(user){
                userId = user.email

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
                return updatedClassesData

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
            <ListItem bottomDivider = {true} style = {{ width: '12.5%', borderColor: '#434659', borderWidth: 1 }} containerStyle = {{ backgroundColor: blueBlack }}>
                <ListItem.Content style = {{  height: height/21 }}>
                    <ListItem.Title style = {{ color: linen }}>{item.title}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        )
    }


    renderItemDaysPhone = ({ item, i }) => {
        return(
            <ListItem bottomDivider = {true} style = {{ width: '100%', borderColor: 'purple', borderWidth: 2 }}>
                <ListItem.Content>
                    <ListItem.Title style = {{ alignSelf: 'center' }}>{item.title}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        )
    }


    renderItemHours = ({ item }) => {
        var hour
        if( item < 12 ){
            hour = item + ":00" + " AM"
        }
        else if( item === 12){
            hour = item + ":00" + " PM"
        }
        else if( item > 12 ){
            hour = item - 12 + ":00" + " PM"
        }

        return(
            <ListItem bottomDivider = {true} style = {{ borderWidth: 1, borderColor: '#434659' }} containerStyle = {{ backgroundColor: blueBlack }}>
                <ListItem.Content>
                    <ListItem.Title style = {{ color: linen }}>{item}:00</ListItem.Title>
                    <ListItem.Subtitle style = {{ color: linen }}>{hour}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }

    
    renderItemMonday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 1;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = {
                    width >= 826 ? [ styles.renderItemActiveClass ] : [ styles.renderItemActiveClassPhone ]
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: rainClass } : {}
                }>
                    <ListItem.Content>
                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: periwinkle }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>
                        
                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                } 
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: rain } ]: [ styles.renderItemContent , { backgroundColor: rain } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: periwinkle }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }
    }


    renderItemTuesday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 2;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = { 
                    width >= 826 ? [ styles.renderItemActiveClass ] : styles.renderItemActiveClassPhone
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: cadetBlue } : {}
                }>
                    <ListItem.Content>

                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: smog }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: smogSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>

                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                }
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: cadetBlue } ]: [ styles.renderItemContent, { backgroundColor: cadetBlue } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: smog }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: smogSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }
    }


    renderItemWednesday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 3;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = {
                    width >= 826 ? [ styles.renderItemActiveClass, { backgroundColor: rain } ] : [ styles.renderItemActiveClassPhone, { backgroundColor: rain } ]
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: rainClass } : {}
                }>
                    <ListItem.Content>
                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: periwinkle }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>
                        
                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                } 
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: rain } ]: [ styles.renderItemContent , { backgroundColor: rain } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: periwinkle }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        } 
    }


    renderItemThursday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 4;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = { 
                    width >= 826 ? [ styles.renderItemActiveClass ] : styles.renderItemActiveClassPhone
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: cadetBlue } : {}
                }>
                    <ListItem.Content>

                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: smog }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: smogSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>

                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                }
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: cadetBlue } ]: [ styles.renderItemContent, { backgroundColor: cadetBlue } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: smog }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: smogSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }

    }


    renderItemFriday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 5;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = {
                    width >= 826 ? [ styles.renderItemActiveClass, { backgroundColor: rain } ] : [ styles.renderItemActiveClassPhone, { backgroundColor: rain } ]
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: rainClass } : {}
                }>
                    <ListItem.Content>
                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: periwinkle }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>
                        
                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                } 
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: rain } ]: [ styles.renderItemContent , { backgroundColor: rain } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: periwinkle }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }

    }


    renderItemSaturday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 6;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = { 
                    width >= 826 ? [ styles.renderItemActiveClass ] : styles.renderItemActiveClassPhone
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: cadetBlue } : {}
                }>
                    <ListItem.Content>

                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: smog }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: smogSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>

                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                }
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: cadetBlue } ]: [ styles.renderItemContent, { backgroundColor: cadetBlue } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: smog }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: smogSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }

    }


    renderItemSunday = ({ item }) => {

        var classes = this.state.classesData;
        var classItem, isClass, x, classData;
        // change in each renderItem
        var day = 0;
        var length = classes.length
        var definiteClassTime

        for( x = 0; x < length; x++ ){

            classItem = classes[x]

            var classDay = moment( classItem.class_date ).day()
            var classStartHour = moment( classItem.class_starting_timing ).hour()
            var classTime = moment( classItem.class_starting_timing ).format('HH:mm')

            if( classDay === day ){

                if( classStartHour === item ){
                    isClass = true
                    classData = classItem
                    definiteClassTime = classTime
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
                <ListItem bottomDivider = {true} style = {
                    width >= 826 ? [ styles.renderItemActiveClass, { backgroundColor: rain } ] : [ styles.renderItemActiveClassPhone, { backgroundColor: rain } ]
                }
                containerStyle = {
                    width >= 826 ? { backgroundColor: rainClass } : {}
                }>
                    <ListItem.Content>
                        <TouchableOpacity
                            onPress = {()=>{
                                this.props.navigation.navigate('ClassDetailsScreen', { "data": classData })
                            }}>
                                <ListItem.Title style = {{ color: periwinkle }}>{ definiteClassTime }</ListItem.Title>
                                <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>{ classData.class_name }</ListItem.Subtitle>
                        </TouchableOpacity>
                        
                    </ListItem.Content>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem bottomDivider = {true} style = {
                    moment().day() === day ? styles.renderItemTodayClass : styles.renderItemClass
                } 
                containerStyle = { 
                    moment().day() === day ? [ styles.renderItemTodayContent, { backgroundColor: rain } ]: [ styles.renderItemContent , { backgroundColor: rain } ]
                }>
                    <ListItem.Content>
                        <ListItem.Title style = {{ color: periwinkle }}>{item}:00</ListItem.Title>
                        <ListItem.Subtitle style = {{ color: periwinkleSubtitle }}>No Class</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            )
        }

    }


    getTodayDay = () => {
        var date = new Date()
        var options = { weekday: 'long' }

        var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
        var day = days[date.getDay()]
        var dayObject = {
                title: day,
                id: "0"
            }
        var data = []
        data.push(dayObject)
        return data;
    }


    whichFunctionToRender = () => {
        var day = moment().day()
        var renderItemThing

        if( day === 1 ){
            renderItemThing = this.renderItemMonday
        } 
        else if( day === 2 ){
            renderItemThing = this.renderItemTuesday
        }
        else if( day === 3 ){
            renderItemThing = this.renderItemWednesday
        }
        else if( day === 4 ){
            renderItemThing = this.renderItemThursday
        }
        else if( day === 5 ){
            renderItemThing = this.renderItemFriday
        }
        else if( day === 6 ){
            renderItemThing = this.renderItemSaturday
        }
        else if( day === 0 ){
            renderItemThing = this.renderItemSunday
        }

        return renderItemThing
    }
 

    render(){
        if( Dimensions.get('window').width >= 826 ){

            return(
                <View style = {{ flex: 2 , height: '100%' }}>
    
                    <View style = {{ width: '100%' }}>
                        <AppHeader title = "Time Table" />
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

                            <ScrollView scrollEnabled = {true} horizontal = {true}>

                                <FlatList 
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemHours}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemMonday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemTuesday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemWednesday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemThursday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                               <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemFriday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemSaturday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />
    
                                <FlatList
                                    data = {this.getVisibleHours()}
                                    renderItem = {this.renderItemSunday}
                                    keyExtractor = {this.keyExtractor}
                                    contentContainerStyle = {{ width: width/8 }}
                                    extraData = {this.state.classesData}
                                    scrollEnabled = {false}
                                />

                            </ScrollView>
    
                        </View>
    
                    </View>
    
                </View>
            )
    
            }
            else{
    
                return(
                    <View style = {{ height: '100%', overflow: 'scroll' }}>
    
                        <AppHeader title = "Time Table" />
    
                        <View style = {{ width: '100%'}}>
    
                            <View style = {{ width: '70%', alignSelf: 'center' }}>
     
                                <View>
                                    <FlatList
                                        data = {this.getTodayDay()}
                                        renderItem = {this.renderItemDaysPhone}
                                        keyExtractor = {this.keyExtractor}
                                    />
                                </View>
    
                                <View>
                                    <FlatList
                                        data = {this.getVisibleHours()}
                                        renderItem = {this.whichFunctionToRender()}
                                        keyExtractor = {this.keyExtractor}
                                        scrollEnabled = {true}
                                    />
                                </View>
    
                            </View>
    
                        </View>
    
                    </View>
                )
    
            }
    
        }
    
}

const styles = StyleSheet.create({

    renderItemClass: {
        borderColor: blueBlack,
        borderWidth: 1
    }, 

    renderItemActiveClass: {
        borderColor: '#F4EBDB',
        borderWidth: 1
    },

    renderItemContent: {
    },

    renderItemTodayClass: {
        flex: 1,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderBottomColor: blueBlack,
        borderTopColor: blueBlack,
        borderWidth: 1
    },

    renderItemTodayContent: {
        backgroundColor: '#EAE2D6'
    },

    renderItemClassPhone: {
        borderColor: blueBlack,
        borderWidth: 1,
    },

    renderItemActiveClassPhone: {
        borderColor: 'green',
        borderWidth: 2, 
    }

})