import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";

const RoomScreen = ({ route }) => {
  console.log("undefined =>", props.route);

  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
    };
    fetchData();
    console.log("Effect executed");
  }, []);

  return isLoading === true ? (
    <ActivityIndicator size="large" color="red" style={{ marginTop: 100 }} />
  ) : (
    <ScrollView>
      <View>
        <Text>Test</Text>
      </View>
    </ScrollView>
  );
};

export default RoomScreen;
