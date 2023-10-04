import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../theme/colors';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import {
  BottomTabNavigatorParamList,
  SearchTabNavigatorParamList,
} from '../types/navigation';
import SearchTabNavigator from './SearchTabNavigator';
import {Text} from 'react-native';
import CameraScreen from '../screens/CameraScreen';

const Tab = createBottomTabNavigator<SearchTabNavigatorParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.black,
      }}>
      <Tab.Screen
        name="Home Stack"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="home-filled" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchTabNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={CameraScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyProfile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="user-circle-o" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
