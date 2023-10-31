import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CreateNavigationProp, CreateRouteProp} from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import {createPost} from './queries';
import {
  CreatePostInput,
  CreatePostMutation,
  CreatePostMutationVariables,
} from '../../API';
import {useMutation} from '@apollo/client';
import {useAuthContext} from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';
import {Storage} from 'aws-amplify';
import {v4 as uuidv4} from 'uuid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CreatePostScreen = () => {
  const route = useRoute<CreateRouteProp>();

  const {userId} = useAuthContext();

  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const [doCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  const navigation = useNavigation<CreateNavigationProp>();

  const {image, video, images} = route.params;

  let content = null;
  if (image) {
    content = (
      <Image
        source={{uri: image}}
        style={styles.image}
        resizeMode={'contain'}
      />
    );
  } else if (images) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} paused={false} />;
  }

  const submit = async () => {
    //upload the media files to S3 and get the key

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const input: CreatePostInput = {
      description,
      type: 'POST',
      image: undefined,
      images: undefined,
      video: undefined,
      nofComments: 0,
      nofLikes: 0,
      userID: userId,
    };

    if (image) {
      const imageKey = await uploadMedia(image);
      console.log(imageKey);

      input.image = imageKey;
    } else if (images) {
      const imageKeys = await Promise.all(images.map(img => uploadMedia(img)));
      input.images = imageKeys.filter(key => key) as string[];
    } else if (video) {
      input.video = await uploadMedia(video);
    }

    try {
      const response = await doCreatePost({
        variables: {
          input,
        },
      });
    } catch (e) {
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
    navigation.popToTop();
    navigation.navigate('Home Stack');
  };

  const uploadMedia = async (uri: string) => {
    try {
      // get the blob of file from uri
      const response = await fetch(uri);
      const blob = await response.blob();

      const uriParts = uri.split('.');

      const extension = uriParts[uriParts.length - 1];
      // upload the file to S3

      const s3Response = await Storage.put(`${uuidv4()}.${extension}`, blob, {
        progressCallback(newProgress) {
          setProgress(newProgress.loaded / newProgress.total);
        },
      });

      return s3Response.key;
    } catch (e) {
      Alert.alert('Error uploading the file');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.root}>
      {/* <Image source={{uri: image}} style={styles.image} /> */}
      <View style={styles.content}>{content}</View>
      <TextInput
        placeholder="Description..."
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button
        text={isSubmitting ? 'Submitting...' : 'Submit'}
        onPress={submit}
      />

      {isSubmitting && (
        <View style={styles.progressContainer}>
          <View style={[styles.progress, {width: `${progress * 100}%`}]} />
          <Text>Uplading {Math.floor(progress * 100)}%</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
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
  progressContainer: {
    backgroundColor: colors.lightgrey,
    width: '100%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  progress: {
    backgroundColor: colors.primary,
    position: 'absolute',
    height: '100%',

    alignSelf: 'flex-start',
    borderRadius: 25,
  },
});
