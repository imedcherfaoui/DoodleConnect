import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../firebase/authContext";

function SignUp() {
  const { userLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    if (!isSigningUp && password === confirmPassword) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigation.navigate("Home");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsSigningUp(false);
      }
    } else {
      setErrorMessage("Passwords do not match");
    }
  };

  return (
    <View style={styles.container}>
      {userLoggedIn && <Text>User is logged in</Text>}
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
      <Button
        title={isSigningUp ? "Signing Up..." : "Sign Up"}
        onPress={onSubmit}
        disabled={isSigningUp}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 10,
    width: 300,
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
  link: {
    marginVertical: 10,
    color: "blue",
  },
});

export default SignUp;
