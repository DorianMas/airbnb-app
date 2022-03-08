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
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ userId, userToken, setToken }) {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

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
        setUser(response.data);
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
        console.log(error.response.data);
        console.log(error.response.status);
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

  const updateInfos = async () => {
    setIsLoading(true);

    const response = await axios.put(
      "https://express-airbnb-api.herokuapp.com/user/update",
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      },
      {
        email: email,
        description: description,
        username: username,
      }
    );
    if (response.data) {
      setIsLoading(false);
      alert("Informations mises à jour !");
      console.log(response.data);
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
      // const response = await axios.post(
      //   "https://upload-file-server-with-js.herokuapp.com/upload",
      //   formData
      // );
      // if (response.data) {
      //   setIsLoading(false);
      //   alert("Photo Envoyée !");
      //   console.log(response.data);
      // }

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        },
        formData
      );
      if (response.data) {
        setIsLoading(false);
        alert("Photo Envoyée !");
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log("UserToken => ", userToken);
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
            <Ionicons name="person" size={80} color="grey" />
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <MaterialIcons name="photo-camera" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <MaterialIcons name="photo-library" size={30} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.updateInfosContainer}>
        <TextInput
          value={email}
          style={styles.emailInput}
          placeholder="email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          value={username}
          style={styles.usernameInput}
          placeholder="username"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          value={description}
          style={styles.descriptionInput}
          placeholder="description"
          onChangeText={(text) => setDescription(text)}
        />
      </View>
      <TouchableOpacity>
        <Button title="Envoi d'une photo au backend" onPress={sendPicture} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Button title="Actualiser les informations" onPress={updateInfos} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logOutContainer} onPress={removeUserId}>
        <Text style={styles.logOutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
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
    padding: 10,
    marginRight: 5,
    marginLeft: 50,
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonsContainer: {
    paddingLeft: 20,
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
  },
  emailInput: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    height: 40,
    width: 250,
    marginTop: 10,
  },
  usernameInput: {
    borderBottomColor: "red",
    borderBottomWidth: 2,
    height: 40,
    width: 250,
    marginTop: 20,
  },
  descriptionInput: {
    borderColor: "red",
    borderWidth: 2,
    height: 100,
    width: 250,
    marginTop: 30,
    paddingHorizontal: 5,
    paddingBottom: 55,
    alignItems: "flex-start",
  },
  logOutContainer: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    width: "60%",
  },
  logOutText: { color: "grey", fontSize: 22, textAlign: "center" },
});
