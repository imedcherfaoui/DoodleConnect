import React, { useState } from "react";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { doSignOut } from "../../../../firebase/auth";
import Messages from "./components/Messages";
import SketchBoard from "./components/SketchBoard";

function Home() {
  const [showMessages, setShowMessages] = useState(false);

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  // Log out function
  const handleSignOut = async () => {
    try {
      await doSignOut();
      /* navigation.navigate("Login"); */
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text>Sign out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMessages} style={styles.chatButton}>
        <Text>{showMessages ? "Hide Chat" : "Show Chat"}</Text>
      </TouchableOpacity>
      <SketchBoard />
      {showMessages && <Messages />}
    </View>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "lightyellow",
  },
  chatButton: {
    position: "absolute",
    top: 50,
    right: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "lightyellow",
  },
});
export default Home;
