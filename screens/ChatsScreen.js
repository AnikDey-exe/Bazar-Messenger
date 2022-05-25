import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image } from 'react-native';
import { ListItem, SearchBar, Icon, Header } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import { TextInput } from 'react-native';
import {Avatar} from 'react-native-elements';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
    "Raleway": require("../assets/Raleway-Regular.ttf"),
    "Raleway-Bold": require("../assets/Raleway-Bold.ttf"),
    "Raleway-Thin": require("../assets/Raleway-Thin.ttf"),
};

export default class ChatsScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            docId: '',
            searchText: '',
            allConversations: [],
            value: '',
            fontsLoaded: false
        },
        this.arrayholder = []
        this.requestRef = null
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }

    
    searchFilterFunction = (text) => {
        this.setState({
          value: text
        })
        const newData = this.arrayholder.filter(item => {      
          const itemData = `${item.name}`.toUpperCase();
          
           const textData = text.toUpperCase();
            
           return itemData.indexOf(textData) > -1;    
        });
        
        this.setState({ allConversations: newData });
      }

    getConversations = () => {
   
        // this.requestRef = db.collection('Conversations') 
        
        //     .onSnapshot((snapshot)=>{
        //         var allConversationsList = snapshot.docs.map(document => document.data());
        //         this.setState({
        //           allConversations : allConversationsList,
        //         })
        //         this.arrayholder = snapshot.docs.map(document => document.data());
        //       })

            this.requestRef = db.collection('Conversations') 
            .orderBy("lastMessageDate", "desc")
            .onSnapshot((snapshot)=>{
                var conversations = []
                snapshot.docs.map((doc)=>{
                    var conversation = doc.data()
                    conversation['doc_id'] = doc.id
                    conversations.push(conversation)
                });

                // console.log("all msgs:", allMessages)

                var allConversations = conversations.filter((conv) => { return conv.targetedUserId == this.state.userId })
               
                this.setState({
                    allConversations: allConversations
                })

                 this.arrayholder = conversations.filter((conv) => { return conv.targetedUserId == this.state.userId })
                console.log(this.state.allConversations)
            })
       
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({item, index}) => {
        var date = item.lastMessageDate.toDate() + '';
        var finalDate = date.split(' ');
        var actualDate = date.split(' ')[1] + ' ' + date.split(' ')[2] + ', ' + date.split(' ')[3]; 
        console.log(item.lastMessageDate);
        return (
            <ListItem
                style={{ marginLeft: 10, marginRight: 10}}
                key={index}
                title={item.name}
                subtitle={item.lastMessage}
                subtitleStyle={{ fontSize: 15, color: 'grey', marginTop: 5 }}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                leftElement={
                    <Avatar
                        rounded
                        source={{ uri: item.image }}
                        size="medium"
                        containerStyle={{

                            marginTop: 0

                        }}/>
                }
                rightElement={
                  // this.state.allConversations.map((date)=>{
                        <Text key={index} style={{color: 'grey', marginBottom: 20}}> {actualDate} </Text>
                    // })
                }
                onPress={()=>{this.props.navigation.navigate("Converse",{"details": item})}}
                bottomDivider
            />
        )
    }

    componentDidMount() {
        this.getConversations();
       this._loadFontsAsync();
    }

    render() {
        return(
            <View style={{flex:1, backgroundColor: 'white'}}>
                <Header
                leftComponent={<Icon name={'arrow-left'} type={'feather'} color='#f75a4f' onPress={() => {this.props.navigation.navigate('Settings')}} />}
                centerComponent={{ text: '', style: { color: 'white'} }}
                rightComponent={<Icon name='plus' type='font-awesome' color='#f75a4f' onPress={() => {this.props.navigation.navigate('Create')}} />}
                //backgroundColor="#f0eded"
                backgroundColor="transparent"  
                //backgroundColor= '#0d1d52'
            
                />
                <View style={{width: '100%', flexDirection: 'row'}}>
                    <View style={{width: '75%'}}>
                        <Text style={{fontSize:30, fontWeight:'bold', marginTop:0, paddingLeft: 5, fontFamily: 'Raleway'}}> Conversations </Text>
                    </View>
                    {/* <View style={{width: '25%', alignContent: 'flex-end', flexDirection: 'row'}}>
                        <TouchableOpacity style={{backgroundColor: 'black', marginTop: 60, borderRadius: 25, width: 30, height: 30}}>
                            <Text style={{color: 'white'}}> Add </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: 'black', marginTop: 60, marginLeft: 10, borderRadius: 25,  width: 30, height: 30}}>
                            <Text style={{color: 'white'}}> Settings </Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <View style={{marginTop:10, padding: 10}}>
                    <SearchBar
                    containerStyle={{height:47.5}}
                    inputContainerStyle={{height:20}}
                    lightTheme
                    placeholder="Search"
                    onChangeText={text => this.searchFilterFunction(text)}
                    round
                    autoCorrect={false}
                    value={this.state.value}/>
                </View>

                {/* <View> */}
                    <FlatList
                    containerStyle={{backgroundColor: 'rgba(255, 255, 255, 0.0)'}}
                    keyExtractor={this.keyExtractor}
                    data={this.state.allConversations}
                    renderItem={this.renderItem}/>
                {/* </View> */}
            </View>
        )
    }
}