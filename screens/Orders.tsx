import { Entypo } from "@expo/vector-icons";
import {
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
} from "react-native";
import {
  Avatar,
  Divider,
  IconButton,
  Snackbar,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";

import CustomView from "../components/CustomView";
import CustomText from "../components/CustomText";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDeliveries } from "../api/order";
import useDriverStore from "../store/Driver";
import Verify from "../components/Verify";

const Orders = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const queryClient = useQueryClient();
  const driver = useDriverStore((state) => state.driver);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDismissSnackBar = () => setErrorMessage(null);

  const { error, isLoading, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["Deliveries"],
      queryFn: ({ pageParam }: { pageParam: number }) =>
        getDeliveries({ page: pageParam, token: driver!.token }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length < 10 ? undefined : allPages.length + 1;
        return nextPage;
      },
    });

  const listData = useMemo(() => {
    if (data === undefined) return [];
    return data.pages.flat();
  }, [data]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["Deliveries"],
    });
  }, []);

  const onScroll = ({ nativeEvent }: any) => {
    const shouldStartLoading =
      Math.floor(
        nativeEvent?.contentOffset?.y + nativeEvent?.layoutMeasurement?.height
      ) === Math.floor(nativeEvent?.contentSize?.height);
    if (shouldStartLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <CustomView style={{ flex: 1 }}>
      <FlatList
        data={listData}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Verify
            id={item._id}
            userName={item.fullName}
            phoneNumber={item.phoneNumber}
            location={item.location}
          />
        )}
        keyExtractor={(item) => item._id}
      />

      {isLoading && <ActivityIndicator animating={true} />}
      <Snackbar
        visible={!!errorMessage}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: "#31363F" }}
        duration={2000}
      >
        <CustomText style={{ color: "white" }}>{errorMessage}</CustomText>
      </Snackbar>
    </CustomView>
  );
};

interface IOrder {
  id: string;
  userName: string;
  location: string;
  phoneNumber: number;
}

const Order = ({ userName, phoneNumber, location, id }: IOrder) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate("Verify", { id })}>
      <CustomView style={styles.order}>
        <CustomView style={styles.container}>
          <Avatar.Text size={40} label={userName[0].toUpperCase()} />
          <CustomView>
            <CustomText style={styles.title}>
              {userName.toUpperCase()}
            </CustomText>
            <CustomText>{location}</CustomText>
          </CustomView>
        </CustomView>
        <IconButton
          icon={(_) => <Entypo name="phone" size={24} color="#52C41A" />}
          rippleColor="#52C41A"
          onPress={() => Linking.openURL(`tel:+251${phoneNumber}`)}
        />
      </CustomView>
      <Divider style={{ backgroundColor: "grey", marginHorizontal: 15 }} />
    </Pressable>
  );
};

export default Orders;

const styles = StyleSheet.create({
  order: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontWeight: "bold",
  },
});
