import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";

import { Entypo } from "@expo/vector-icons";

const HomeScreen = (props) => {
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
    };
    fetchData();
  }, []);

  /* Fonction pour afficher le nombre d'étoiles*/
  const generateStars = (numberOfStars) => {
    let starsArrays = [];
    for (let i = 0; i < 5; i++) {
      if (i < numberOfStars) {
        starsArrays.push(
          <Entypo name="star" size={22} color="#DAA520" key={i} />
        );
      } else {
        starsArrays.push(<Entypo name="star" size={22} color="grey" key={i} />);
      }
    }
    return starsArrays;
  };

  const navigation = useNavigation();

  return isLoading === true ? (
    <ActivityIndicator size="large" color="red" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <FlatList
        style={styles.offersList}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          // console.log(item);
          return (
            <TouchableOpacity
              style={styles.offerContainer}
              onPress={() => {
                props.navigation.navigate("Room", { id: item._id });
              }}
            >
              <ImageBackground
                style={styles.illustration}
                source={{ uri: item.photos[0].url }}
              >
                <Text style={styles.price}>{item.price} €</Text>
              </ImageBackground>
              <View style={styles.offerDetails}>
                <View style={styles.offerDetailsLeft}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.title}
                  </Text>
                  <View style={styles.row}>
                    {generateStars(item.ratingValue)}
                  </View>
                  <Text>{item.reviews} reviews</Text>
                </View>

                <Image
                  style={styles.avatar}
                  source={{ uri: item.user.account.photo.url }}
                />
              </View>
            </TouchableOpacity>
          );
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
    marginHorizontal: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  offersList: { borderTopColor: "grey", borderTopWidth: 1 },
  title: {
    paddingVertical: 10,
    fontWeight: "bold",
  },
  offerContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: 250,
    marginVertical: 10,
  },
  illustration: {
    width: Dimensions.get("window").width * 0.9,
    height: 150,
    justifyContent: "flex-end",
  },
  offerDetails: { flexDirection: "row", justifyContent: "space-between" },
  row: { flexDirection: "row" },
  price: {
    backgroundColor: "black",
    color: "white",
    width: 50,
    padding: 5,
    textAlign: "center",
    marginBottom: 10,
  },
  offerDetailsLeft: { flex: 4, marginRight: 5 },
  avatar: { width: 50, height: 50, borderRadius: 50, marginTop: 5 },
});

export default HomeScreen;
