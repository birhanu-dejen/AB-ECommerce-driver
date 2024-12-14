import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomView from "../components/CustomView";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import { Button, Snackbar } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { deliverOrder } from "../api/order";
import useDriverStore from "../store/Driver";
import { StackScreenProps } from "@react-navigation/stack";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { RootStackParamList } from "../App";

type Props = StackScreenProps<RootStackParamList, "Verify">;

const Verify = ({ route ,navigation}: Props) => {
  const [key, setKey] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const driver = useDriverStore((state) => state.driver);

  const onDismissSnackBar = () => setErrorMessage(null);

  const { mutate } = useMutation({
    mutationFn: deliverOrder,
    onSuccess: (data: any) => {
      navigation.navigate("Home", { screen: 'Orders' })
    },
    onError: (error: any) => {
      setErrorMessage(error.message);
    },
  });

  function handleVerification() {
    mutate({ id: route.params.id, key, token: driver!.token });
  }

  return (
    <CustomView style={{ flex: 1 }}>
      <CustomView style={{ padding: 15 }}>
        <CustomInput
          autoCapitalize="none"
          placeholder="Type verification key"
          onChangeText={(e) => setKey(e)}
        />
        <View style={{ height: 5 }} />
        <Button
          mode="contained"
          style={{ borderRadius: 10 }}
          onPress={handleVerification}
        >
          <CustomText style={{ color: "white" }}>Verify</CustomText>
        </Button>
      </CustomView>

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

export default Verify;

const styles = StyleSheet.create({});
