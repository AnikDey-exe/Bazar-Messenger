import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image, TextInput } from 'react-native';
import { ListItem, SearchBar, Icon, Header } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import {Avatar} from 'react-native-elements';
import * as Font from "expo-font";

let customFonts = {
    "Raleway": require("../assets/Raleway-Regular.ttf"),
    "Raleway-Bold": require("../assets/Raleway-Bold.ttf"),
    "Raleway-Thin": require("../assets/Raleway-Thin.ttf"),
};

export default class CreateScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            targetedUserId: '',
            firstName: '',
            lastName: '',
            contact: '',
            docId: '',
            userName: '',
            targetUserName: '',
            description: '',
            userImage: '',
            targetUserImage: '',
            query: [],
            secQuery: [],
            users: [],
            conversations: [],
            fontsLoaded: false
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }

    getUsers = () => {
        db.collection('Users')
        .onSnapshot((snapshot)=>{
            var data = snapshot.docs.map(document => document.data());
            this.setState({
              users : data
            });
        })
        console.log(this.state.users)
    }

    getConversations = () => {
        db.collection('Conversations')
        .onSnapshot((snapshot)=>{
            var data = snapshot.docs.map(document => document.data());
            this.setState({
              conversations : data
            });
        })
        console.log(this.state.conversations)
    }

    getUserDetails = () => {
        db.collection("Users").where('emailID','==',this.state.userId).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
          var data = doc.data()
            this.setState({
              firstName : data.emailID,
              lastName  : data.lastName,
              contact   : data.contact,
              docId     : doc.id,
              userName: data.firstName + " " + data.lastName,
              description: data.description,
              userImage: data.profilePicture
            })
          });
        })
    }

    getTargetUserDetails = () => {
        db.collection("Users").where('emailID','==',this.state.targetedUserId).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
          var data2 = doc.data()
            this.setState({
              targetUserName: data2.firstName + " " + data2.lastName,
              targetUserImage: data2.profilePicture
            })
            console.log(this.state.targetUserName);
          });
        })
        
    }

    fetchImage = (imageName) => {
        var storageRef = firebase.storage().ref().child("user_profiles/"+imageName);
        storageRef.getDownloadURL()
        .then((url)=>{
            this.setState({
                image: url
            })
        })
        .catch((error)=>{
            this.setState({
                image: '#'
            })
        })
    }

    createId(){
        return Math.random().toString(36).substring(7);
    }

    createConversation = () => {
        
        // .onSnapshot((snapshot)=>{
        //     var addedExplanationsList = snapshot.docs.map(document => document.data());
        //     this.setState({
        //       addedExplanationsList : addedExplanationsList
        //     });
        //     this.arrayholder = snapshot.docs.map(document => document.data());
        //   })
        var query = db.collection('Users').where('emailID','==',this.state.targetedUserId)
        .onSnapshot((snapshot)=>{
            var data = snapshot.docs.map(document => document.data());
            this.setState({
              query : data
            });
           
        })
        console.log('query '+this.state.query.length)
        if(this.state.query.length === 0){
            console.log('query '+this.state.query.length)
            this.setState({
                query: [],
                secQuery: [],
                targetedUserId: ''
            }) 
            return alert('This user does not exist')
        }
        else {
            var secQuery = db.collection('Conversations').where('targetedUserId','==',this.state.targetedUserId).where('targetedUserId2','==',this.state.userId)
            .onSnapshot((snapshot)=>{
                var data = snapshot.docs.map(document => document.data());
                this.setState({
                  secQuery : data
                });
            })
              console.log('Secquery'+ this.state.secQuery.length)
            if(this.state.secQuery.length === 0) {
                if(this.state.targetedUserId !== this.state.userId) {
                    console.log('Secquery'+ this.state.secQuery.length)
                    var conversationId = this.createId();
        
                    db.collection("Conversations").add({
                        'name': this.state.userName,
                        'targetedUserId': this.state.targetedUserId,
                        'targetedUserId2': this.state.userId,
                        'lastMessage': '',
                        'lastMessageDate': '',
                        'image': this.state.userImage,
                        'conversationId': conversationId
                    })
            
                    db.collection("Conversations").add({
                        'name': this.state.targetUserName,
                        'targetedUserId': this.state.userId,
                        'targetedUserId2': this.state.targetedUserId,
                        'lastMessage': '',
                        'lastMessageDate': '',
                        'image': this.state.targetUserImage,
                        'conversationId': conversationId
                    })

                    this.setState({
                        query: [],
                        secQuery: [],
                        targetedUserId: ''
                    })

                    return alert('Conversation initiated.')
                    
                }
                else {
                    this.setState({
                        query: [],
                        secQuery: [],
                        targetedUserId: ''
                    })

                    return alert('You cannot start a conversation with yourself.')
                }

            }
            else {
                this.setState({
                    query: [],
                    secQuery: [],
                    targetedUserId: ''
                })
                return alert('This user already exists in your conversations.')
            }
        }

        this.setState({
            query: [],
            secQuery: [],
            targetedUserId: ''
        })
       
    }

    createConversation2 = () => {
        var users = this.state.users;
        var conversations = this.state.conversations;

        var query = users.find(user => user.emailID === this.state.targetedUserId)

        if(query) {
            var query2 = conversations.find(conversation => conversation.targetedUserId === this.state.targetedUserId && conversation.targetedUserId2 === this.state.userId);
            if(query2) {
                return alert('This user already exists in your conversations.')
            }
            else {
                if(this.state.targetedUserId !== this.state.userId) {
                    console.log(this.state.targetedUserId);
                    this.getTargetUserDetails();
                    console.log(this.state.targetedUserId);

                    var conversationId = this.createId();

                    setTimeout(()=>{
                        db.collection("Conversations").add({
                            'name': this.state.userName,
                            'targetedUserId': this.state.targetedUserId,
                            'targetedUserId2': this.state.userId,
                            'lastMessage': 'Start chatting with your friend!',
                            'lastMessageDate': firebase.firestore.Timestamp.now().toDate(),
                            'image': this.state.userImage,
                            'conversationId': conversationId
                        })
                
                        db.collection("Conversations").add({
                            'name': this.state.targetUserName,
                            'targetedUserId': this.state.userId,
                            'targetedUserId2': this.state.targetedUserId,
                            'lastMessage': 'Start chatting with your friend!',
                            'lastMessageDate': firebase.firestore.Timestamp.now().toDate(),
                            'image': this.state.targetUserImage,
                            'conversationId': conversationId
                        })
                        this.getConversations();
                        this.setState({
                            query: [],
                            secQuery: [],
                            targetedUserId: ''
                        })
                    }, 5000);

                    console.log(this.state.targetUserName);

                    return alert('Conversation initiated.')
                }
                else {
                    return alert('You cannot start a conversation with yourself.')
                }
            }
        } else {
            return alert('User not found.');
        }
    }

    componentDidMount() {
        this.getUserDetails();
        this.fetchImage(this.state.userId);
        this.getUsers();
        this.getConversations();
        this._loadFontsAsync();
        this.setState({
            query: [],
            secQuery: [],
            targetedUserId: ''
        })
    }

    componentWillUnmount() {
        this.setState({
            query: [],
            secQuery: [],
            targetedUserId: ''
        })
    }

    render() {
        return(
            <View style={{flex:1}}>
                <Header
                        leftComponent={<Icon name="arrow-left" type='feather' color='white' onPress={() => this.props.navigation.goBack()} />}
                        centerComponent={{ text: "Create", style: { color: 'white', fontSize: 20, fontWeight: 'bold', height: 50, paddingTop: 10 } }}
                        backgroundColor="#f75a4f"
                    />
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    
                    <View style={{width: '75%'}}>
                        <Text style={{marginLeft: -3, color: '#f75a4f', fontWeight: 'bold'}}> Participant </Text>
                        <TextInput
                        style={{borderBottomWidth: 1, paddingBottom: 5, borderBottomColor:'#f75a4f', fontSize:20, marginTop: 5}}
                        placeholder='Email'
                        onChangeText={(text)=>{
                            this.setState({
                                targetedUserId: text
                            })
                        }}
                        value={this.state.targetedUserId}/>

                        <TouchableOpacity 
                        onPress={()=>{this.createConversation2()}}
                        style={{marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f75a4f', padding: 5, borderRadius: 5, height: 50}}>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}> Create </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}