import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import user from '../../assets/data/user.json';
import styles from './styles';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {ProfileNavigationProp} from '../../types/navigation';
import {Auth} from 'aws-amplify';
// import {User} from '../../models';
import {DEFAULT_USER_IMAGE} from '../../config';
import {User} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';

interface IProfileHeader {
  user: User;
}

const ProfileHeader = ({user}: IProfileHeader) => {
  const {userId} = useAuthContext();

  const navigation = useNavigation<ProfileNavigationProp>();

  navigation.setOptions({title: user.username || 'Profile'});

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Image
          style={styles.avatar}
          source={{uri: user.image || DEFAULT_USER_IMAGE}}
        />
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofPosts}</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofFollowers}</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.nofFollowings}</Text>
          <Text>Following</Text>
        </View>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.bio}</Text>
      {userId === user.id && (
        <View style={{flexDirection: 'row'}}>
          <Button
            text="Edit Profile"
            onPress={() => navigation.navigate('Edit Profile')}
            inline
          />

          <Button text="Sign Out" onPress={() => Auth.signOut()} inline />
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
