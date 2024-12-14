import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  useColorScheme,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import CustomText from "./CustomText";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Portal,
  Snackbar,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomView from "./CustomView";
import CustomInput from "./CustomInput";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliverOrder } from "../api/order";
import useDriverStore from "../store/Driver";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IVerify {
  id: string;
  userName: string;
  location: string;
  phoneNumber: number;
}

const Verify = ({ userName, phoneNumber, location, id }: IVerify) => {
  const isDarkMode = useColorScheme() === "dark";
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const verifyBSheet = useRef<any>(null);
  const onDismissSnackBar = () => setError(null);
  const driver = useDriverStore((state) => state.driver);
  const queryClient = useQueryClient();
  
  const { mutate,isPending } = useMutation({
    mutationFn: deliverOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Deliveries"],
      });
      verifyBSheet.current.close()
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });
  
  function handleVerification() {
    Keyboard.dismiss()
    setError(null);

    mutate({ id, key, token: driver!.token });
  }

  return (
    <View>
      <TouchableOpacity onPress={() => verifyBSheet.current.open()}>
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
      </TouchableOpacity>
      <Portal>
        
      <RBSheet
        ref={verifyBSheet}
        draggable
        dragOnContent
        customStyles={{
          wrapper: { backgroundColor: "#332f3766" },
          container: { backgroundColor: isDarkMode ? "black" : "white" },
        }}
      >
        <CustomView style={styles.listContainer}>
          <CustomText
            style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
          >
            Verify Delivery
          </CustomText>
          <CustomText
            style={{ fontWeight: "bold", textTransform: "capitalize" }}
          >
            verification key
          </CustomText>
          <CustomInput
            autoCapitalize="none"
            placeholder={`Type verification key`}
            onChangeText={(e) => setKey(e)}
          />

          <Button
            mode="contained"
            style={{ borderRadius: 10,zIndex:100 }}
            onPress={handleVerification}
            disabled={isPending}
          >
            <CustomText style={{ color: "white" }}>Verify</CustomText>
          </Button>
        </CustomView>
        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: "#31363F" }}
          duration={2000}
        >
          <CustomText style={{ color: "white" }}>{error}</CustomText>
        </Snackbar>
      </RBSheet>
      </Portal>

    </View>
  );
};

export default Verify;

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
    padding: 15,
  },
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
