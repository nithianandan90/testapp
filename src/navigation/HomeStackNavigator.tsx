import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import logo from '../assets/images/logo.png';
import {Image} from 'react-native';
import {HomeStackNavigatorParamList} from '../types/navigation';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator = () => {
  const HeaderTitle = () => {
    return (
      <Image
        source={logo}
        resizeMode="contain"
        style={{width: 150, height: 40}}
      />
    );
  };
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{headerTitle: HeaderTitle, headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{title: 'Profile'}}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
