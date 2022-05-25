import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from 'react-native';
import { ListItem, SearchBar, Icon, Header } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import { TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Font from "expo-font";

let customFonts = {
    "Raleway": require("../assets/Raleway-Regular.ttf"),
    "Raleway-Bold": require("../assets/Raleway-Bold.ttf"),
    "Raleway-Thin": require("../assets/Raleway-Thin.ttf"),
};

export default class SettingsScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            firstName: '',
            lastName: '',
            contact: '',
            userId: firebase.auth().currentUser.email,
            profilePicture: '',
            docId: '',
            description: '',
            userName: '',
            fontsLoaded: false
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }

    getUserDetails = () => {
        db.collection("Users").where('emailID', '==', this.state.userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var data = doc.data()
                    this.setState({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        contact: data.contact,
                        docId: doc.id,
                        userName: data.firstName + " " + data.lastName,
                        description: data.description,
                    })
                });
            })
    }

    updateProfilePicture = (url) => {
        db.collection("Users").doc(this.state.docId)
            .update({
                'profilePicture': url
            })

        db.collection('Conversations')
            .where('targetedUserId2', '==', this.state.userId)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    db.collection('Conversations').doc(doc.id).update({
                        image: url
                    })
                    // doc.update({
                    //   lastMessage: this.state.message,
                    //   lastMessageDate: firebase.firestore.Timestamp.now().toDate()
                    // })
                });
            })

        this.setState({
            profilePicture: url
        })

        return alert('Changes to your profile picture will occur once the application restarts.')
    }

    fetchImage = (imageName) => {
        var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
        storageRef.getDownloadURL()
            .then((url) => {
                this.setState({
                    profilePicture: url
                })
                db.collection("Users").doc(this.state.docId)
                .update({
                    'profilePicture': url
                })
                db.collection('Conversations')
            .where('targetedUserId2', '==', this.state.userId)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    db.collection('Conversations').doc(doc.id).update({
                        image: url
                    })
                    // doc.update({
                    //   lastMessage: this.state.message,
                    //   lastMessageDate: firebase.firestore.Timestamp.now().toDate()
                    // })
                });
            })
            })
            .catch((error) => {
                this.setState({
                    profilePicture: '#'
                })
            })
    }

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!cancelled) {
            this.uploadImage(uri, this.state.userId);
        }
    };

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        return ref.put(blob)
            .then((response) => {
                this.fetchImage(imageName);
                //this.updateProfilePicture(uri);
            });
    };

    updateUserProfileDetails = () => {
        db.collection("Users").doc(this.state.docId)
            .update({
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "contact": this.state.contact,
                "description": this.state.description
            })

        alert("Your Profile Has Been Updated. Changes will occur once the app restarts.");
    }

    componentDidMount() {
        this.getUserDetails();
        this.fetchImage(this.state.userId);
        this._loadFontsAsync();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftComponent={<Icon name="arrow-left" type='feather' color='white' onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={{ text: "Settings", style: { color: 'white', fontSize: 20, fontWeight: 'bold', height: 50, paddingTop: 10 } }}
                    backgroundColor="#f75a4f"
                />


                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.profilePicture
                        }}
                        size="xlarge"
                        onPress={() => { this.selectPicture() }}
                        containerStyle={{
                            marginTop: 0
                        }}
                        showEditButton />
                    <View style={{ width: '75%' }}>

                        <Text style={{ marginLeft: -3, color: '#f75a4f', fontWeight: 'bold', marginTop: 10 }}> First Name </Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#f75a4f', fontSize: 20, marginTop: 5 }}
                            placeholder='Name'
                            onChangeText={(text) => {
                                this.setState({
                                    firstName: text
                                })
                            }}
                            value={this.state.firstName} />

                        <Text style={{ marginLeft: -3, color: '#f75a4f', fontWeight: 'bold', marginTop: 10 }}> Last Name </Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#f75a4f', fontSize: 20, marginTop: 5 }}
                            placeholder='Name'
                            onChangeText={(text) => {
                                this.setState({
                                    lastName: text
                                })
                            }}
                            value={this.state.lastName} />

                        <Text style={{ marginLeft: -3, color: '#f75a4f', fontWeight: 'bold', marginTop: 10 }}> Email </Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#f75a4f', fontSize: 20, marginTop: 5 }}
                            placeholder='Email'
                            onChangeText={(text) => {
                                this.setState({
                                    userId: text
                                })
                            }}
                            value={this.state.userId} />

                        <Text style={{ marginLeft: -3, color: '#f75a4f', fontWeight: 'bold', marginTop: 10 }}> Contact </Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#f75a4f', fontSize: 20, marginTop: 5 }}
                            placeholder='Phone Number'
                            onChangeText={(text) => {
                                this.setState({
                                    contact: text
                                })
                            }}
                            value={this.state.contact} />

                        <Text style={{ marginLeft: -3, color: '#f75a4f', fontWeight: 'bold', marginTop: 10 }}> About Me </Text>
                        <TextInput
                            style={{ borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#f75a4f', fontSize: 20, marginTop: 5 }}
                            placeholder='Tell us about yourself!'
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => {
                                this.setState({
                                    description: text
                                })
                            }}
                            value={this.state.description} />

                        <TouchableOpacity
                            onPress={() => { this.updateUserProfileDetails() }}
                            style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f75a4f', padding: 5, borderRadius: 5, height: 50 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}> Update </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('Login')
                                firebase.auth().signOut()
                            }}>


                            <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', fontWeight: '600', textDecorationLine: 'underline', marginTop: 20 }}
                            > Sign Out </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}