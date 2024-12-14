import {
  TextInput,
  Text,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import { IconButton } from "react-native-paper";

const CustomInput = (props: TextInput["props"]) => {
  const [isHidden, setIsHidden] = useState(true);
  const isDarkMode = useColorScheme() === "dark";
  const { style, ...otherProps } = props;

  return (
    <View
      style={[
        styles.container,
        { borderColor: isDarkMode ? "white" : "black" },
      ]}
    >
      <TextInput
        {...otherProps}
        placeholderTextColor="grey"
        secureTextEntry={otherProps.secureTextEntry && isHidden}
        style={[
          styles.input,
          style,
          {
            color: isDarkMode ? "white" : "black",
          },
        ]}
      />
      {otherProps.secureTextEntry && (
        <IconButton
          icon={isHidden ? "eye-off" : "eye"}
          iconColor="grey"
          rippleColor="grey"
          size={18}
          onPress={() => {
            setIsHidden((prev) => !prev);
          }}
        />
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
});
