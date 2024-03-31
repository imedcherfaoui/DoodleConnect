import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  FIREBASE_DB,
  FIREBASE_AUTH,
} from "../../../../../firebase/firebaseConfig";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef();

  // Function to send a message
  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        await addDoc(collection(FIREBASE_DB, "messages"), {
          text: newMessage,
          timestamp: new Date(),
          userId: FIREBASE_AUTH.currentUser.uid, // Ajouter l'ID de l'utilisateur actuel à chaque message
        });
        setNewMessage(""); // Clear après l'envoi
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Fonction pour récupérer les messages depuis Firestore et les mettre à jour dans le state
  useEffect(() => {
    const q = query(collection(FIREBASE_DB, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);

  // Scroll en bas de la liste de messages à chaque nouveau message
  useLayoutEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messageContainer}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.userId === FIREBASE_AUTH.currentUser.uid
                ? styles.userMessage
                : styles.otherUserMessage,
            ]}
          >
            <Text>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message"
          style={styles.input}
        />
        <Button onPress={sendMessage} title="Send" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    right: 20,
    alignSelf: "flex-end",
    padding: 10,
    height: 200,
    width: 300,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightyellow",
    backgroundColor: "lightyellow",
  },
  messageContainer: {
    flexGrow: 1,
  },
  message: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: "lightblue",
  },
  otherUserMessage: {
    backgroundColor: "lightgray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
});

export default Messages;
