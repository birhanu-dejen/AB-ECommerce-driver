import { View } from "react-native";
import { useColorScheme } from "react-native";

const CustomView = (props: View["props"]) => {
  const isDarkMode = useColorScheme() === "dark";
  const { style, children } = props;

  return (
    <View style={[{ backgroundColor: isDarkMode ? "black" : "white" }, style]}>
      {children}
    </View>
  );
};

export default CustomView;
