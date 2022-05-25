import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Dimensions } from 'react-native';
import { ListItem, SearchBar, Icon, Header } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import { TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from "expo-font";

let customFonts = {
    "Raleway": require("../assets/Raleway-Regular.ttf"),
    "Raleway-Bold": require("../assets/Raleway-Bold.ttf"),
    "Raleway-Thin": require("../assets/Raleway-Thin.ttf"),
};

export default class ConverseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      name: this.props.navigation.getParam('details')["name"],
      image: this.props.navigation.getParam('details')["image"],
      lastMessage: this.props.navigation.getParam('details')["lastMessage"],
      lastMessageDate: this.props.navigation.getParam('details')["lastMessageDate"],
      conversationId: this.props.navigation.getParam('details')["conversationId"],
      targetedUserId: this.props.navigation.getParam('details')["targetedUserId"],
      targetedUserId2: this.props.navigation.getParam('details')["targetedUserId"],
      allMessages: [],
      profilePicture: '',
      width: 0,
      percent: 0,
      message: '',
      fontsLoaded: false
    }
    this.requestRef = null
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  getMessages = () => {
    this.requestRef = db.collection('Messages')
      //.where("messagePostId", "==", this.state.requestID)
      .orderBy("date", "asc")
      .onSnapshot((snapshot) => {
        var messages = [];
        snapshot.docs.map((doc) => {
          var message = doc.data()
          message['doc_id'] = doc.id
          messages.push(message)
        });

        // console.log("all msgs:", allMessages)

        var allMessages = messages.filter((msg) => { return msg.messageId == this.state.conversationId })

        this.setState({
          allMessages: allMessages
        })
      })
  }

  getDimensions() {
    const width = Dimensions.get('window').width / 1.6666667;
    this.setState({
      percent: width,
    });
  }

  componentDidMount() {
    this.getMessages();
    this.getDimensions();
    this._loadFontsAsync();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  addMessage = (message) => {
    db.collection('Messages').add({
      "message": message,
      "messageId": this.state.conversationId,
      "author": this.state.userId,
      "date": firebase.firestore.Timestamp.now().toDate()
    })

    console.log(this.state.allMessages);

    var messageToUpdate = this.state.message;

    db.collection('Conversations')
      .where('conversationId', '==', this.state.conversationId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection('Conversations').doc(doc.id).update({ 
            'lastMessage': messageToUpdate,
            'lastMessageDate': firebase.firestore.Timestamp.now().toDate()
          })
          // doc.update({
          //   lastMessage: this.state.message,
          //   lastMessageDate: firebase.firestore.Timestamp.now().toDate()
          // })
        });
      })

    this.setState({
      message: ''
    })
  }

  findDimensions(layout) {
    const { x, y, width, height } = layout;

    console.log(width);
    this.setState({
      width: width,
    });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    if (item.author === this.state.userId) {
      if (this.state.width > this.state.percent) {
        return (
          <>
          <View
          //  onLayout={(event) => {
          //   this.findDimensions(event.nativeEvent.layout);
          // }}
          key={index}
          style={styles.container3}>
            <Text> {item.message}</Text>
          </View>
          
            {/* <ListItem
              onLayout={(event) => {
                this.findDimensions(event.nativeEvent.layout);
              }}
              key={index}
              containerStyle={styles.container3}
              title={item.message}
              titleStyle={{ fontSize: 15, color: 'white', alignSelf: 'flex-end' }}
              bottomDivider
            /> */}
          </>)
      }
      else {
        return (
          <>
           <View
            // onLayout={(event) => {
            //   this.findDimensions(event.nativeEvent.layout);
            // }}
          key={index}
          style={styles.container4}>
            <Text style={{color: 'white'}}> {item.message}</Text>
          </View>
            {/* <View style={styles.container4}> */}
            {/* <ListItem
              onLayout={(event) => {
                this.findDimensions(event.nativeEvent.layout);
              }}
              key={index}
              containerStyle={styles.container4}
              title={item.message}
              titleStyle={{ fontSize: 15, color: 'white', alignSelf: 'flex-end' }}
              bottomDivider
            /> */}
          {/* </View> */}

          </>)
      }
    } else {
      if (this.state.width > this.state.percent) {
        return (
          <>
          <View
            // onLayout={(event) => {
            //   this.findDimensions(event.nativeEvent.layout);
            // }}
          key={index}
          style={styles.container}>
            <Text style={{color: 'black'}}> {item.message}</Text>
          </View>
            {/* <ListItem
              onLayout={(event) => {
                this.findDimensions(event.nativeEvent.layout);
              }}
              key={index}
              // containerStyle={styles.container}
              title={item.message}
              titleStyle={{ fontSize: 15, color: 'black', alignSelf: 'flex-start' }}
              bottomDivider
            /> */}


          </>)
      }
      else {
        return (
          <>
          <View
            // onLayout={(event) => {
            //   this.findDimensions(event.nativeEvent.layout);
            // }}
          key={index}
          style={styles.container2}>
            <Text style={{color: 'black'}}> {item.message}</Text>
          </View>
            {/* <ListItem
              onLayout={(event) => {
                this.findDimensions(event.nativeEvent.layout);
              }}
              key={index}
              // containerStyle={styles.container2}
              title={item.message}
              titleStyle={{ fontSize: 15, color: 'black', alignSelf: 'flex-start' }}
              bottomDivider
            /> */}


          </>
        )
      }
    }

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{ alignItems: 'center', justifyContent: 'center'}}
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="white"
              onPress={() => this.props.navigation.goBack()}
              style={{ paddingTop: 2.5 }}
            />
          }
          centerComponent={

            {
              text: this.state.name,
              style: {
                color: 'white',
                fontSize: 20,
                // fontWeight: 'bold',
                //height: 0,
                paddingTop: 0,
                alignSelf: 'center'
              },

            }
          }
          rightComponent={
            <Avatar
              rounded
              source={{
                uri: this.state.image
              }}
              size="small"
            //onPress={() => { this.selectPicture() }}

            />
          }
          backgroundColor="#f75a4f"
        />


        <FlatList
          containerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.0)'}}
          keyExtractor={this.keyExtractor}
          data={this.state.allMessages}
          renderItem={this.renderItem}
          inverted 
          contentContainerStyle={{ flexDirection: 'column-reverse', bottom: 80}} />




        <KeyboardAvoidingView behavior="padding" enabled
          style={{
            position: 'absolute',
            bottom: 20,
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            borderTopWidth: 0.25,
            padding: 5,
            //shadowColor: 'grey',
            //shadowOpacity: 0.7,
            //shadowRadius: 20,
            borderTopColor: '#d4d4d4',
            paddingLeft: 10,
            paddingRight: 10
          }}>

          <TextInput
            placeholder="Type a message"
            style={{
              borderWidth: 0.5,
              width: '88.5%',
              height: 40,
              paddingLeft: 10,
              borderRadius: 20,
              borderColor: '#d4d4d4',
              marginTop: 10
            }}
            placeholderTextColor="black"
            onChangeText={(text) => {
              this.setState({
                message: text
              })
            }}
            value={this.state.message}
          />

          <TouchableOpacity
            style={{
              //alignSelf: 'end',
              borderWidth: 0.5,
              width: '11.5%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: '#f75a4f',
              borderColor: '#f75a4f',
              marginLeft: 2.5,
              marginTop: 10
            }}
            onPress={() => {
              this.addMessage(this.state.message)
            }}>

            <Text> Send </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 25,
    marginRight: 10,
    paddingRight: 10,
    marginTop: 5,
    width: '61%'
  },
  container2: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: '#dadce0',
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
    paddingRight: 12,
    marginTop: 5,
    marginRight: 5,
  },
  container3: {
    flexDirection: 'row',
    //alignSelf:"flex-start",
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1982fc',
    padding: 12,
    alignSelf: 'flex-end',
    borderRadius: 25,
    marginRight: 10,
    paddingRight: 12,
    marginTop: 5,
    width: '61%'
  },
  container4: {
    flexDirection: 'row',
    //alignSelf:"flex-start",
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1982fc',
    padding: 12,
    alignSelf: 'flex-end',
    borderRadius: 25,
    marginRight: 10,
    paddingRight: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  container5: {
    flexDirection: 'row',
    //alignSelf:"flex-start",
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1982fc',
    padding: 12,
    alignSelf: 'flex-end',
    borderRadius: 25,
    marginRight: 10,
    paddingRight: 10,
    marginTop: 5
  }
})