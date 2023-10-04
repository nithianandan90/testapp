import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, View, Image, ActivityIndicator} from 'react-native';
import CommentsScreen from '../screens/CommentsScreen/CommentsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import {RootNavigatorParamList} from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';
import {useAuthContext} from '../contexts/AuthContext';
import {getUser} from './queries';
import {useQuery} from '@apollo/client';
import {GetUserQuery, GetUserQueryVariables} from '../API';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: ['notjustdev://'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Comments: 'comments',
      Home: {
        screens: {
          HomeStack: {
            initialRouteName: 'Feed',
            screens: {UserProfile: 'user/:userId'},
          },
        },
      },
    },
  },
};

const Navigation = () => {
  const {user, userId} = useAuthContext();
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {variables: {id: userId}},
  );

  const userData = data?.getUser;

  if (user === undefined || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} />
      </View>
    );
  }

  let stackScreens = null;
  if (!user) {
    stackScreens = (
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{headerShown: false}}
      />
    );
  } else if (!userData?.username) {
    stackScreens = (
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Setup Profile'}}
      />
    );
  } else {
    stackScreens = (
      <>
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{title: 'Comments'}}
        />
      </>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Group>{stackScreens}</Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderTitle = () => {
  return (
    <Image
      source={logo}
      resizeMode="contain"
      style={{width: 150, height: 40}}
    />
  );
};

export default Navigation;
