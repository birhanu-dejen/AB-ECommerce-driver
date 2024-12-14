import {
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  MD3Colors,
  PaperProvider,
  Portal,
  Snackbar,
} from "react-native-paper";
import CustomText from "./CustomText";

import { useMutation } from "@tanstack/react-query";
import { deleteDriver } from "../api/driver";
import useDriverStore from "../store/Driver";

const Delete = () => {
  const [visible, setVisible] = useState(false);
  const driver = useDriverStore((state) => state.driver);
  const sign = useDriverStore((state) => state.sign);
  const isDarkMode = useColorScheme() === "dark";
  const [error, setError] = useState<string | null>(null);

  const onDismissSnackBar = () => setError(null);

  const { mutate } = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      sign(null)
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  function handleDelete() {
    mutate({ id: driver!.id, token: driver!.token });
  }
  return (
    <>
      <IconButton
        icon="delete-outline"
        iconColor={MD3Colors.error50}
        rippleColor={MD3Colors.error80}
        size={18}
        mode="outlined"
        style={{ borderRadius: 5, borderColor: "grey" }}
        onPress={showDialog}
      />

      <Portal>
        <PaperProvider>
          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={{ backgroundColor: isDarkMode ? "black" : "white" }}
          >
            <Dialog.Title>Delete Account</Dialog.Title>
            <Dialog.Content>
              <CustomText>Are you sure you want to delete?</CustomText>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDelete}>
                <CustomText style={{color:"red"}}>Delete</CustomText>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </PaperProvider>
        <Snackbar
        visible={!!error}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: "#31363F" }}
        duration={2000}
      >
        <CustomText style={{ color: "white" }}>{error}</CustomText>
      </Snackbar>
      </Portal>

    </>
  );
};

export default Delete;

const styles = StyleSheet.create({});
