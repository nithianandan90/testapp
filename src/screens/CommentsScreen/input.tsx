import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';

const Input = () => {
  const [newComment, setNewComment] = useState('new comment');
  const onPost = () => {
    console.warn('Posting the comment', newComment);
    setNewComment('');
  };

  return (
    <View style={styles.root}>
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg',
        }}
        style={styles.image}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        style={styles.input}
        multiline={true}
        placeholder="Write your comment..."
      />
      <Text onPress={onPost} style={styles.button}>
        POST
      </Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-end',
  },

  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },

  input: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 5,
    paddingRight: 50,
    marginLeft: 5,
  },

  button: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    fontSize: fonts.size.s,
    fontWeight: fonts.weight.full,
    color: colors.primary,
  },
});
