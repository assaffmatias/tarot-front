import React, { useEffect } from "react";
import { Box, Button, Icon, Image, Skeleton, Text, View, SafeAreaView } from "react-native-magnus";
import { InfinityScroll, Filter } from "../components";
import { useFetch } from "../hooks";
import { ActivityIndicator, Pressable } from "react-native";
import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";
import { useAuthStore, useNotificationStore } from "../stores";
import { api } from "../axios";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Home = () => {
  const { data: last_adquires = [], loading } = useFetch({
    fetch: true,
    url: "/services/last_adquires",
  });

  const navigation = useNavigation()

  const { width } = Dimensions.get("window");
  const scale = width / 375;
  const scaleFontSize = (size) => size * scale;

  const notif = useNotificationStore((state) => state.notifications);
  const user = useAuthStore((state) => state.userInfo);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // console.log("estoy por pedir notificaciones con" + user._id);
        const response = await api.GET(`/notifications/${user._id}`);
        // console.log("los datos son ", response);
        response.forEach(notification => addNotification(notification));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  // Verificar que el estado de userInfo está correctamente inicializado
if (!user) {
 navigation.navigate(stackRoutesNames.LOGIN)
}

  return (
    <Box flex={1} w={"90%"} alignSelf="center">
      <Text
        fontFamily="Bold"
        fontSize={"4xl"}
        color="#191970"
        textAlign="center"
      >
        ARCANO
      </Text>

      <Box flexDir="row" justifyContent="space-between">
        <Button
          bg="transparent"
          onPress={() =>
            navigate(stackRoutesNames.NOTIFICATIONS, {
              _id: "66ee08c0ded49463f9bd6ba5",
            })
          }
        >
          <Icon
            fontFamily="Ionicons"
            name="notifications"
            fontSize={scaleFontSize(25)}
            color="#191970"
          />
          {notif.length >= 1 && (
            <Text style={{ position: 'absolute', bottom: 10, left: 10, color: '#191970', fontSize: scaleFontSize(20) }}>●</Text>
          )}
        </Button>

        <Button
          bg="transparent"
          onPress={() =>
            navigate(stackRoutesNames.CHAT_LIST, {
              _id: "66ee08c0ded49463f9bd6ba5",
            })
          }
        >
          <Icon
            fontFamily="Ionicons"
            name="chatbubbles-sharp"
            fontSize={25}
            color="#191970"
          />
        </Button>
      </Box>

      <Filter />

      <Box
        mt={"lg"}
        w={"93%"}
        flexDir="column"
        alignSelf="center"
        justifyContent="center"
      >
        {/* Verificación del rol antes de mostrar "Últimas contrataciones" */}
        {!loading && last_adquires[0] && user?.role !== "USER_TAROT" && (
          <Box>
            <Text fontSize={"md"} fontFamily="Medium" color="gray">
              Últimas contrataciones
            </Text>
            <Box flexDir="row">
              {loading && <ActivityIndicator size={"small"} color={"#000"} />}
              {Array.isArray(last_adquires) && last_adquires.map((data, i) => (
                <Pressable
                  key={data._id + i}
                  onPress={() => navigate(stackRoutesNames.DETAILS, { data })}
                >
                  <Image
                    rounded={50}
                    resizeMode="contained"
                    mr={"lg"}
                    my={"lg"}
                    key={data._id}
                    // source={{ uri: apiUrl + `/uploads/service/${data._id}` }}
                    // source={'https://media.lmneuquen.com/p/483fc38db569a6f012e7492d6e6e64d0/adjuntos/195/imagenes/007/420/0007420976/770x0/smart/jimena-la-torrejpg.jpeg'}
                    source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-wizard-holds-the-fire-as-he-walks-through-the-forest-image_2924861.jpg' }}
                    w={45}
                    h={45}
                    loadingIndicatorSource={<Skeleton.Circle h={45} w={45} />}
                  />
                </Pressable>
              ))}
            </Box>
          </Box>
        )}

        <Text fontFamily="Bold" mb={15} fontSize={"lg"}>
          ¡Encuentra los mejores tarotistas!
        </Text>
      </Box>

      <InfinityScroll />
    </Box>
  );
};

export default Home;
