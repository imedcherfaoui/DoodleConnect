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
import {
  doPasswordReset,
  doSignInWithEmailAndPassword,
} from "../../../firebase/auth";
import { useAuth } from "../../../firebase/authContext";

function Login() {
  const { userLoggedIn } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigation.navigate("Home");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const handleNavigateSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleForgotPassword = async () => {
    try {
      await doPasswordReset(email);
      setErrorMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
      <Button
        title={isSigningIn ? "Signing In..." : "Sign In"}
        onPress={onSubmit}
        disabled={isSigningIn}
      />

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNavigateSignUp}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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

export default Login;
