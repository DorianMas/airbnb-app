import {
  Button,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Person from "../assets/person-icon.png";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({ userId, userToken, setToken }) {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  console.log(userId);
  console.log(userToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }
        );
        setIsLoading(false);
        S;
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }

      // console.log("les informations retournées par axios => ", response.data);
      // console.log("Objet à l'intérieur de User =>", user);
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.put(
  //       `https://express-airbnb-api.herokuapp.com/user/update`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + userToken,
  //         },
  //         email: email,
  //         description: description,
  //         username: username,
  //       }
  //     );
  //     // setUser(response.data);
  //     setIsLoading(false);
  //     console.log("les informations retournées par axios => ", response);
  //   };
  //   fetchData();
  // }, [isLoading]);

  const [selectedPicture, setSelectedPicture] = useState(null);

  const removeUserId = async () => {
    try {
      await AsyncStorage.removeItem("userId", userId);
      setToken(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getPermissionAndGetPicture = async () => {
    //Demander le droit d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      //ouvrir la galerie photo
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.cancelled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        console.log(result.uri);
        setSelectedPicture(result.uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      //ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();
      // console.log(result);
      setSelectedPicture(result.uri);
    } else {
      alert("Permission refusée");
    }
  };

  const sendPicture = async () => {
    setIsLoading(true);

    const tab = selectedPicture.split(".");
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab[1]}`,
        type: `image/${tab[1]}`,
      });
      const response = await axios.post(
        "https://upload-file-server-with-js.herokuapp.com/upload",
        formData
      );
      if (response.data) {
        setIsLoading(false);
        alert("Photo Envoyée !");
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="red" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <View style={styles.pictureContainer}>
          {selectedPicture ? (
            <Image source={{ uri: selectedPicture }} style={styles.picture} />
          ) : (
            <Image source={Person} style={{ width: 100, height: 100 }} />
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <MaterialIcons name="photo-camera" size={50} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <MaterialIcons name="photo-library" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        value={email}
        style={styles.emailInput}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Envoi d'une photo au backend" onPress={sendPicture} />
      <Button title="Log Out" onPress={removeUserId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "rgb(252, 252, 252)", width: "100%" },
  headContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pictureContainer: {
    borderRadius: 80,
    borderColor: "red",
    borderWidth: 2,
    padding: 20,
    marginRight: 5,
  },
  picture: {
    width: 200,
    height: 200,
  },
  buttonsContainer: { justifyContent: "space-between" },
  emailInput: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    height: 40,
    width: 300,
    marginTop: 40,
  },
});
