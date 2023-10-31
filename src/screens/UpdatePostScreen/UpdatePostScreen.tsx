import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CreateNavigationProp,
  UpdatePostRouteProp,
} from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import {
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {useMutation, useQuery} from '@apollo/client';
import {useAuthContext} from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';
import {getPost, updatePost} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const UpdatePostScreen = () => {
  const {userId} = useAuthContext();

  const [description, setDescription] = useState('');

  const navigation = useNavigation<CreateNavigationProp>();

  const route = useRoute<UpdatePostRouteProp>();

  const {id} = route.params;

  const {data, loading, error} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {variables: {id}},
  );

  const post = data?.getPost;

  const [doUpdatePost, {error: updateError, data: updateData}] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  useEffect(() => {
    if (data) {
      setDescription(data?.getPost?.description || '');
    }
  }, [data]);

  useEffect(() => {
    if (updateData) {
      navigation.goBack();
    }
  }, [updateData, navigation]);

  const submit = async () => {
    if (!post) {
      return;
    }
    const response = doUpdatePost({
      variables: {input: {id: post.id, _version: post._version, description}},
    });
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || updateError) {
    return (
      <ApiErrorMessage
        title="Failed to fetch the post"
        message={error?.message || updateError?.message}
      />
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        placeholder={description}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button text="Submit" onPress={submit} />
    </View>
  );
};

export default UpdatePostScreen;

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  root: {
    alignItems: 'center',
    padding: 20,
  },
  input: {
    alignSelf: 'stretch',
    marginVertical: 10,
    backgroundColor: colors.white,
  },
  content: {
    width: '100%',
    aspectRatio: 1,
  },
});
