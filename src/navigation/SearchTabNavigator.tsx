import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CommentsScreen from '../screens/CommentsScreen/CommentsScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../theme/colors';
import {SearchTabNavigatorParamList} from '../types/navigation';
import UserSearchScreen from '../screens/UserSearchScreen/UserSearchScreen';

const Tab = createMaterialTopTabNavigator<SearchTabNavigatorParamList>();

const SearchTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {paddingTop: insets.top},
        tabBarIndicatorStyle: {backgroundColor: colors.primary},
      }}>
      <Tab.Screen name="Users" component={UserSearchScreen} />
      <Tab.Screen name="Posts" component={CommentsScreen} />
    </Tab.Navigator>
  );
};

export default SearchTabNavigator;
