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
  Dimensions,
  FlatList,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const RoomScreen = ({ route }) => {
  console.log("Objet =>", route);

  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        );
        setData(response.data);
        console.log(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error.response.status);
        console.log(error.response.data);
      }
    };
    fetchData();
    console.log("Effect executed");
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
  const { width } = Dimensions.get("window");

  // Création des coordonnées de la Map
  // const markers = [
  //   {
  //     id: data._id,
  //     latitude: data.location[0],
  //     longitude: data.location[1],
  //     title: data.title,
  //     description: data.description,
  //   },
  // ];

  return isLoading === true ? (
    <ActivityIndicator size="large" color="red" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.offerContainer}>
      <SwiperFlatList
        autoplay
        autoplayDelay={5}
        autoplayLoop
        index={0}
        showPagination
        data={data.photos}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={{ height: "100%", flex: 1, width: width }}
          />
        )}
      />

      <View style={styles.offerDetailsContainer}>
        <Text style={styles.price}>{data.price} €</Text>
        <View style={styles.offerDetails}>
          <View style={styles.offerDetailsLeft}>
            <Text numberOfLines={1} style={styles.title}>
              {data.title}
            </Text>
            <View style={styles.reviewsContainer}>
              <View style={styles.row}>{generateStars(data.ratingValue)}</View>
              <Text>{data.reviews} reviews</Text>
            </View>
          </View>
          <Image
            style={styles.avatar}
            source={{ uri: data.user.account.photo.url }}
          />
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {data.description}
        </Text>
      </View>
      <MapView
        // La MapView doit obligatoirement avoir des dimensions
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >
        <MapView.Marker
          key={data._id}
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
          title={data.title}
          description={data.description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  offerContainer: { flex: 1 },
  illustration: {
    width: Dimensions.get("window").width,
    height: 200,
  },
  offerDetailsContainer: { marginHorizontal: 5 },
  price: {
    backgroundColor: "black",
    color: "white",
    width: 50,
    padding: 5,
    textAlign: "center",
    marginBottom: 10,
    position: "absolute",
    top: 170,
  },
  title: {
    paddingVertical: 10,
    fontWeight: "bold",
  },
  offerDetails: { flexDirection: "row", justifyContent: "space-between" },
  row: { flexDirection: "row" },
  offerDetailsLeft: { flex: 4, marginRight: 5 },
  reviewsContainer: { flexDirection: "row", alignItems: "center" },
  reviews: { color: "grey" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 5,
    marginRight: 5,
  },
  description: { marginVertical: 10 },
});

export default RoomScreen;
