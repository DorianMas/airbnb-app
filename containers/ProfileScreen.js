import { Button, Text, View, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { ActivityIndicator } from "react-native-web";
import * as ImagePicker from "expo-image-picker";

import Person from "../assets/person-icon.png";

export default function ProfileScreen({ setToken, userId, userToken }) {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );
      setUser(response.data);
      setIsLoading(false);
      console.log("les informations retournées par axios => ", response.data);
      console.log("Objet à l'intérieur de User =>", user);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Hello Settings</Text>

      <TouchableOpacity>
        {user.photo === null ? (
          <Image source={Person} />
        ) : (
          <Image source={user.photo} style={{ width: 100, height: 100 }} />
        )}
      </TouchableOpacity>
      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
        }}
      />
    </View>
  );
}
