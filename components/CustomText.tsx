import { Text } from "react-native";
import { useColorScheme } from "react-native";

const CustomText = (props: Text["props"]) => {
  const isDarkMode = useColorScheme() === "dark";
  const { style, children } = props;
  return (
    <Text style={[{ color: isDarkMode ? "white" : "black" }, style]}>
      {children}
    </Text>
  );
};

export default CustomText;
