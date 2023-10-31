import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import {useAuthContext} from '../../contexts/AuthContext';
import {useMutation, useQuery} from '@apollo/client';
import {createComment, getUser} from './queries';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useCommentsService from '../../services/CommentsService/CommentsService';

interface IInput {
  postId: string;
}

const Input = (props: IInput) => {
  const {postId} = props;

  const [newComment, setNewComment] = useState('new comment');
  //get the user image

  const {userId} = useAuthContext();

  const insets = useSafeAreaInsets();

  const {onCreateComment} = useCommentsService(postId);

  //query the user image
  const {data} = useQuery<GetUserQuery, GetUserQueryVariables>(getUser, {
    variables: {id: userId},
  });

  const onPost = () => {
    onCreateComment(newComment);

    // console.warn('Posting the comment', newComment);
    setNewComment('');
  };

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <Image
        source={{
          uri: data?.getUser?.image || DEFAULT_USER_IMAGE,
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
      <Text
        onPress={onPost}
        style={[styles.button, {bottom: insets.bottom + 7}]}>
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
