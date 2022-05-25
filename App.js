/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Node } from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   TouchableOpacity
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 import { createSwitchNavigator } from 'react-navigation';
 import { createAppContainer } from 'react-navigation';
 import LoginScreen from './screens/LoginScreen';
 import ChatsScreen from './screens/ChatsScreen';
 import CreateScreen from './screens/CreateScreen';
 import SettingsScreen from './screens/SettingsScreen';
 import ConverseScreen from './screens/ConverseScreen';
 import { createStackNavigator } from 'react-navigation-stack';
 import { useFonts } from "@use-expo/font";
 import * as Font from "expo-font";
 import { AppLoading } from "expo";
 
 const customFonts = {
   "Raleway": require("./assets/Raleway-Regular.ttf"),
   "Raleway-Bold": require("./assets/Raleway-Bold.ttf"),
   //"Raleway-Thin": require("./assets/Raleway-Thin.ttf"),
 };
 
 export default function App(){
 
   // chat = () => {
   //   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   //   const authToken = process.env.TWILIO_AUTH_TOKEN;
   //   const client = require('twilio')('AC05a8f9c8954ce381a656725a27905bd7', '9cf549e860dda8bf63e13a20ac418623');
 
   //   client.conversations.conversations('CH78fb60acc88a4edf985c7a2310f1d37e')
   //     .fetch()
   //     .then(conversation => console.log(conversation.chatServiceSid));
 
   //   client.conversations.conversations('CH78fb60acc88a4edf985c7a2310f1d37e')
   //     .participants
   //     .create({
   //       'messagingBinding.address': '+14708413575',
   //       'messagingBinding.proxyAddress': '+18105102835'
   //     })
   //     .then(participant => console.log(participant.sid));
   // }
 
   // componentDidMount() {
   //   //this.chat();
   // }
 
     const [isLoaded] = useFonts(customFonts);
   
     return (
         <AppContainer/>   
     );
   
 };
 
 const AppStackNavigator = createStackNavigator({
   Chats: {screen: ChatsScreen, navigationOptions: {
     headerShown: false
   }},
   Create: {screen: CreateScreen, navigationOptions: {
     headerShown: false
   }},
   Settings: {screen: SettingsScreen, navigationOptions: {
     headerShown: false
   }},
   Converse: {screen: ConverseScreen, navigationOptions: {
     headerShown: false
   }},
 })
 
 const switchNavigator = createSwitchNavigator({
   Login: {screen: LoginScreen},
   Stack: {screen: AppStackNavigator}
 })
 
 const AppContainer =  createAppContainer(switchNavigator);
 