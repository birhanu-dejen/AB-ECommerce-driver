import React, { useState } from "react";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {
  View,
  Keyboard,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";

import { driverSignIn, forgotPasswordDriver } from "../api/driver";
import CustomView from "../components/CustomView";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import useDriverStore from "../store/Driver";

const KeyboardAvoidingComponent = () => {
  const [error, setError] = useState<string | null>(null);

  const showError = (error: string) => setError(error);

  const onDismissSnackBar = () => setError(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.signIn}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <CustomView style={styles.container}>
            <CustomText style={styles.title}>AB STORE</CustomText>
            <CustomText style={styles.subtitle}>Sign-In</CustomText>
            <Form showError={showError} />
          </CustomView>
        </View>
      </TouchableWithoutFeedback>
      <Snackbar
        visible={!!error}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: "#31363F" }}
        duration={2000}
      >
        <CustomText style={{ color: "white" }}>{error}</CustomText>
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const Form = ({ showError }: { showError: (error: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sign = useDriverStore((state) => state.sign);

  const { mutate ,isPending} = useMutation({
    mutationFn: driverSignIn,
    onSuccess: async ({
      data,
    }: {
      data: {
        id: string;
        token: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    }) => {

      sign({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token: data.token,
      });
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const { mutate: forgotMutate, isPending: forgetIsPending } = useMutation({
    mutationFn: forgotPasswordDriver,
    onSuccess: (data) => showError(data.message),
    onError: (error) => {console.log(error);showError(error.message)},
  });

  function handleSignIn() {
    mutate({ email, password });
  }

  function handleForgot() {
    if (email.length >= 0) {
      forgotMutate(email);
    } else showError("Please input valid email address!");
  }

  return (
    <>
      <CustomText style={styles.label}>Email-Address</CustomText>
      <CustomInput
        autoCapitalize="none"
        placeholder="Type your email"
        onChangeText={(e) => setEmail(e)}
      />
      <CustomText style={styles.label}>Password</CustomText>
      <CustomInput
        secureTextEntry
        autoCapitalize="none"
        placeholder="Type your password"
        onChangeText={(e) => setPassword(e)}
      />
      <CustomView style={{ flexDirection: "row", alignItems: "center" }}>
        <CustomText>Forgot password ?</CustomText>
        <Button mode="text" onPress={handleForgot} disabled={forgetIsPending} loading={forgetIsPending}>
          Get One Time Password
        </Button>
      </CustomView>
      <Button
        mode="contained"
        disabled={isPending}
        style={{
          borderRadius: 10,
        }}
        onPress={handleSignIn}
      >
        <CustomText style={{ color: "white" }}>Submit</CustomText>
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  signIn: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#177AD5",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  label: {
    fontWeight: "bold",
  },
  container: {
    width: wp(85),
    gap: 10,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default KeyboardAvoidingComponent;
