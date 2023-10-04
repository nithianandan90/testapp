import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import React from 'react';
import user from '../../assets/data/user.json';
import ProfileHeader from './ProfileHeader';
import FeedGridView from '../../components/FeedGridView';
import {
  UserProfileNavigationProp,
  UserProfileRouteProp,
  MyProfileNavigationProp,
  MyProfileRouteProp,
} from '../../types/navigation';
import {useQuery} from '@apollo/client';
import {getUser} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {GetUserQuery, GetUserQueryVariables} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp | MyProfileRouteProp>();

  const navigation = useNavigation<
    UserProfileNavigationProp | MyProfileNavigationProp
  >();

  const {userId: authUserId} = useAuthContext();

  console.log('authUser', authUserId);

  const userId = route.params?.userId || authUserId;

  console.log('userid', userId);

  // navigation.setOptions({title: user[0].username});

  const {data, loading, error, refetch} = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(getUser, {
    variables: {id: userId},
  });

  if (loading) {
    return <ActivityIndicator />;
  }
  const user = data?.getUser;

  if (error || !user) {
    console.log(error);
    return (
      <ApiErrorMessage
        title="Error fethching posts"
        message={error?.message || 'User not found'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    // <View></View>
    <FeedGridView
      data={user?.Posts?.items || []}
      ListHeaderComponent={() => <ProfileHeader user={user} />}
      refetch={refetch}
      loading={loading}
    />
  );
};

export default ProfileScreen;
