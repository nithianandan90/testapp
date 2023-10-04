import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {User} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';

interface IUserListItem {
  user: User;
}

const UserListItem = ({user}: IUserListItem) => {
  return (
    <View style={styles.root}>
      <Image
        source={{uri: user?.image || DEFAULT_USER_IMAGE}}
        style={styles.image}
      />
      <View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
    </View>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  name: {},
  username: {},
  root: {
    flexDirection: 'row',
  },
});
