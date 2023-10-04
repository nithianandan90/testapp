import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import user from '../../assets/data/user.json';
import UserListItem from '../../components/UserListItem/UserListItem';
import {useQuery} from '@apollo/client';
import {listUsers} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {ListUsersQuery, ListUsersQueryVariables} from '../../API';

const UserSearchScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListUsersQuery,
    ListUsersQueryVariables
  >(listUsers);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching users" message={error.message} />
    );
  }

  const users = (data?.listUsers?.items || []).filter(
    user => user && !user._deleted,
  );

  return (
    <FlatList
      data={users}
      renderItem={({item}) => <UserListItem user={item} />}
      onRefresh={() => refetch()}
      refreshing={loading}
    />
  );
};

export default UserSearchScreen;
