import { StyleSheet } from "react-native";
import CustomView from "../components/CustomView";
import CustomText from "../components/CustomText";
import {
  Avatar,
  Divider,
} from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Delete from "../components/Delete";
import Edit from "../components/Edit";
import { driverChangePassword, updateDriver } from "../api/driver";
import useDriverStore from "../store/Driver";

const Settings = () => {
  const driver=useDriverStore(state=>state.driver)
  return (
    <CustomView style={{ flex: 1 }}>
      <>
        <CustomView style={styles.setting}>
          <CustomView style={styles.container}>
            <Avatar.Icon
              size={40}
              icon={() => <AntDesign name="user" size={24} color="white" />}
            />
            <CustomView>
              <CustomText style={styles.title}>Change Name</CustomText>
              <CustomText>{`${driver!.firstName} ${driver!.lastName}`}</CustomText>
            </CustomView>
          </CustomView>
          <Edit title="User Name" firstPlaceholder="first name" secondPlaceholder="last name" request={updateDriver}/>
        </CustomView>
        <Divider style={{backgroundColor:"grey",marginHorizontal:15}}/>
      </>
      <>
        <CustomView style={styles.setting}>
          <CustomView style={styles.container}>
            <Avatar.Icon
              size={40}
              icon={() => <AntDesign name="mail" size={24} color="white" />}
            />
            <CustomView>
              <CustomText style={styles.title}>Email</CustomText>
              <CustomText>{`${driver!.email}`}</CustomText>
            </CustomView>
          </CustomView>
        </CustomView>
        <Divider style={{backgroundColor:"grey",marginHorizontal:15}}/>
      </>
      <>
        <CustomView style={styles.setting}>
          <CustomView style={styles.container}>
            <Avatar.Icon
              size={40}
              icon={() => <AntDesign name="key" size={24} color="white" />}
            />
            <CustomView>
              <CustomText style={styles.title}>Change Password</CustomText>
              <CustomText>personalize your security</CustomText>
            </CustomView>
          </CustomView>
          <Edit title="Password" firstPlaceholder="password" secondPlaceholder="confirm password" request={driverChangePassword}/>
        </CustomView>
        <Divider style={{backgroundColor:"grey",marginHorizontal:15}}/>
      </>
      <>
        <CustomView style={styles.setting}>
          <CustomView style={styles.container}>
            <Avatar.Icon
              size={40}
              icon={() => (
                <MaterialIcons name="delete-outline" size={24} color="white" />
              )}
            />
            <CustomView>
              <CustomText style={styles.title}>Deactivate Account</CustomText>
              <CustomText>delete your account permanently</CustomText>
            </CustomView>
          </CustomView>
          <Delete/>
        </CustomView>
        
      </>
      
    </CustomView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  setting: {
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
  button: {
    borderRadius: 5,
  },
});
