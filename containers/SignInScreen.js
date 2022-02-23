import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const login = async () => {
    try {
      if (email && password) {
        setError("");

        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          {
            email: email,
            password: password,
          }
        );
        console.log(response.data);
        setToken(response.data.token);
      } else {
        setError("Please fill all fields");
      }
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text>Sign in</Text>

          <TextInput
            value={email}
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            placeholder="Your Email"
          />
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="Your Password"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.btn} onPress={login}>
            <Text>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
            style={styles.btn2}
          >
            <Text>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  btn: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 20,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  btn2: { marginTop: 20 },
});
