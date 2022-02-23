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
  FlatList,
} from "react-native";

const HomeScreen = ({ token }) => {
  const navigation = useNavigation();

  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token !== null) {
          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms`
          );
          setData(response.data);
        } else {
          navigation.navigate("SignIn");
        }
      } catch (error) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <View style={styles.offerContainer}>
              <Text>
                <Text style={styles.title}>{item.title}</Text>;
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.reviews}>{item.reviews} reviews</Text>
              </Text>
              <Image
                style={styles.illustration}
                source={item.user.account.photo.url}
              />
              <Image style={styles.avatar} source={item.photos[0]} />
            </View>
          );
        }}
      />

      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    height: 400,
    width: 500,
  },
  offerContainer: { width: 250, height: 200 },
});

export default HomeScreen;
