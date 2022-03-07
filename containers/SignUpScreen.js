import {
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/core";

import axios from "axios";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const createAccount = async () => {
    // console.log(email, username, password, confirmPassword, description);
    try {
      if (email && username && password && confirmPassword && description) {
        setError("");
        if (password === confirmPassword) {
          const response = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            {
              email: email,
              password: password,
              username: username,
              description: description,
            }
          );
          console.log(response.data);
          setToken(response.data.token);

          const userId = JSON.stringify(response.data.id);

          // console.log(response.data.id);

          await AsyncStorage.setItem("userId", userId);
        } else {
          setError("Les 2 MDP ne sont pas identiques !");
        }
      } else {
        setError("Remplir tous les champs !");
      }
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data);

      if (
        error.response.data.error === "This username already has an account." ||
        error.response.data.error === "This email already has an account."
      ) {
        setError(error.response.data.error);
      }
    }
  };
  return (
    <KeyboardAwareScrollView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text>Sign up</Text>

          <TextInput
            value={email}
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            placeholder="email"
          />
          <TextInput
            value={username}
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            placeholder="username"
          />
          <TextInput
            value={description}
            style={styles.descriptionInput}
            onChangeText={(text) => setDescription(text)}
            placeholder="Description yourself in a few words..."
          />
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="password"
            secureTextEntry={true}
          />
          <TextInput
            value={confirmPassword}
            style={styles.input}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="confirm password"
            secureTextEntry={true}
          />
          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={createAccount}>
            <Text>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
            style={styles.btn2}
          >
            <Text>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    marginVertical: 25,
  },
  logo: {
    width: 100,
    height: 100,
  },
  input: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    height: 40,
    width: 300,
    marginTop: 40,
  },
  descriptionInput: {
    borderColor: "red",
    borderWidth: 2,
    height: 100,
    width: 300,
    paddingBottom: 40,
    marginTop: 40,
    paddingLeft: 10,
  },
  btn: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 30,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  btn2: { marginTop: 20 },
});
