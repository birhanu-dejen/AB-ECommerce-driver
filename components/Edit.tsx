import { Keyboard, StyleSheet, Text, View, useColorScheme } from "react-native";
import React, { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomView from "./CustomView";
import CustomInput from "./CustomInput";
import CustomText from "./CustomText";
import { Button, IconButton, Snackbar } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import useDriverStore from "../store/Driver";

interface IEdit {
  title: string;
  firstPlaceholder: string;
  secondPlaceholder: string;
  request: ({
    id,
    token,
    value1,
    value2,
  }: {
    id: string;
    token: string;
    value1: string;
    value2: string;
  }) => Promise<any>;
}

const Edit = ({
  title,
  firstPlaceholder,
  secondPlaceholder,
  request,
}: IEdit) => {
  const isDarkMode = useColorScheme() === "dark";
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const driver = useDriverStore((state) => state.driver);
  const updateName = useDriverStore((state) => state.updateName);
  const refRBSheet = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDismissSnackBar = () => setError(null);

  const { mutate,isPending } = useMutation({
    mutationFn: request,
    onSuccess: () => {
      if (title !== "Password") {
        updateName({ firstName: firstValue.toUpperCase(), lastName: secondValue.toUpperCase() });
      }
      refRBSheet.current.close()
    },
    onError: (error: any) => {
      setError(error.message)
    },
  });

  function handleUpdate() {
    Keyboard.dismiss()
    setError(null);
    if (title !== "Password") {
      if (firstValue.trim().length === 0) {
        setError("First name input field is required");
        return;
      } else if (secondValue.trim().length === 0) {
        setError("Last name input field is required");
        return;
      }
    }
    if (title === "Password") {
      const pattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$"
      );
      if (!pattern.test(firstValue)) {
        setError(
          "Password must contain at-least one uppercase, lowercase, special character, number and min 8 char"
        );

        return;
      } else if (firstValue !== secondValue) {
        setError("Password and confirm password must match");
        return;
      }
    }

    mutate({
      id: driver!.id,
      value1: firstValue,
      value2: secondValue,
      token: driver!.token,
    });
  }
  return (
    <View>
      <IconButton
        icon="pencil"
        iconColor="#52C41A"
        rippleColor="#52C41A"
        size={18}
        mode="outlined"
        style={{ borderRadius: 5, borderColor: "grey" }}
        onPress={() => refRBSheet.current.open()}
      />
      <RBSheet
        height={350}
        ref={refRBSheet}
        draggable
        dragOnContent
        customStyles={{
          wrapper:{backgroundColor:"#332f3766"},
          container: { backgroundColor: isDarkMode ? "black" : "white" },
        }}
      >
        <CustomView style={styles.listContainer}>
          <CustomText
            style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
          >
            Edit {title}
          </CustomText>
          <CustomText
            style={{ fontWeight: "bold", textTransform: "capitalize" }}
          >
            {firstPlaceholder}
          </CustomText>
          <CustomInput
            secureTextEntry={title === "Password"}
            autoCapitalize="none"
            placeholder={`Type your ${firstPlaceholder}`}
            onChangeText={(e) => setFirstValue(e)}
          />
          <CustomText
            style={{ fontWeight: "bold", textTransform: "capitalize" }}
          >
            {secondPlaceholder}
          </CustomText>
          <CustomInput
            secureTextEntry={title === "Password"}
            autoCapitalize="none"
            placeholder={`Type your ${secondPlaceholder}`}
            onChangeText={(e) => setSecondValue(e)}
          />
          <Button
            mode="contained"
            style={{ borderRadius: 10 }}
            onPress={handleUpdate}
            disabled={isPending}
          >
            <CustomText style={{ color: "white" }}>Update</CustomText>
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

    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
    padding: 15,
  },
});
