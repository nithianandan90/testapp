import {ActivityIndicator, Image, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import user from '../../assets/data/user.json';
import {useForm} from 'react-hook-form';
import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  GetUserQuery,
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  User,
  UsersByUsernameQuery,
  UsersByUsernameQueryVariables,
} from '../../API';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';
import {deleteUser, getUser, updateUser, usersByUsername} from './queries';
import {useAuthContext} from '../../contexts/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {Auth} from 'aws-amplify';
import styles from './styles';
import {DEFAULT_USER_IMAGE} from '../../config';
import CustomInput from './CustomInput';

const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

type IEditableUserField = 'name' | 'username' | 'website' | 'bio';

type IEditableUser = Pick<User, IEditableUserField>;

const newUser: IEditableUser = user;

const EditProfileScreen = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Asset | null>(null);

  const {control, handleSubmit, setValue} = useForm<IEditableUser>();

  const navigation = useNavigation();

  const {userId, user: authUser} = useAuthContext();

  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(
    getUser,
    {
      variables: {id: userId},
    },
  );

  const [getUsersByUsername] = useLazyQuery<
    UsersByUsernameQuery,
    UsersByUsernameQueryVariables
  >(usersByUsername);

  const [
    runUpdateUser,
    {data: updateData, loading: updateLoading, error: updateError},
  ] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser, {
    errorPolicy: 'all',
  });

  const [runDelete, {loading: deleteLoading, error: deleteError}] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(deleteUser);

  const user = data?.getUser;

  useEffect(() => {
    setValue('name', user?.name || '');
    setValue('username', user?.username || '');
    setValue('website', user?.website || '');
    setValue('bio', user?.bio || '');
  }, [user]);

  const onSubmit = async (formData: IEditableUser) => {
    console.log(formData, user?._version, userId);

    const input = {id: userId, ...formData, _version: user?._version};

    console.log(input);

    await runUpdateUser({
      variables: {
        input: input,
      },
    });

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const confirmDelete = () => {
    Alert.alert('Are you sure?', 'Deleting your user profile is permanent', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Yes, delete', style: 'destructive', onPress: startDeleting},
    ]);
  };

  const startDeleting = async () => {
    if (!user) {
      return;
    }

    //delete from DB
    await runDelete({
      variables: {input: {id: userId, _version: user?._version}},
    });
    //delete from cognitio
    authUser?.deleteUser(err => {
      if (err) {
        console.log(err);
      }
    });

    Auth.signOut();
  };

  const validateUsername = async (username: string) => {
    //query the DB based on usersbyUsername

    try {
      const response = await getUsersByUsername({
        variables: {username: username},
      });

      if (response.error) {
        Alert.alert('Failed to fetch username');
        return 'Failed to fetch username ';
      }

      const users = response.data?.usersByUsername?.items;

      if (users && users.length > 0 && users?.[0]?.id !== userId) {
        return 'Username is already taken';
      }
    } catch (e) {
      Alert.alert('Failed to fetch username');
    }
    return true;

    //if there are users with username, then return the error
  };

  const onChangePhoto = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          setSelectedPhoto(assets[0]);
        }
      },
    );
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || updateError || deleteError) {
    return (
      <ApiErrorMessage
        title="Error fetching the User"
        message={error?.message || updateError?.message}
      />
    );
  }

  return (
    <View style={styles.page}>
      <Image
        source={{uri: selectedPhoto?.uri || user?.image || DEFAULT_USER_IMAGE}}
        style={styles.avatar}
      />
      <Text onPress={onChangePhoto} style={styles.textButton}>
        Change Profile Photo
      </Text>
      <CustomInput
        control={control}
        rules={{
          required: 'Name is Required',
          minLength: {value: 10, message: 'must be longer than 10'},
        }}
        name="name"
        label="Name"
      />
      <CustomInput
        control={control}
        rules={{
          required: 'Username is Required',
          minLength: {value: 3, message: 'must be longer than 3'},
          validate: validateUsername,
        }}
        name="username"
        label="Username"
      />
      <CustomInput
        control={control}
        rules={{pattern: {value: URL_REGEX, message: 'Invalid URL'}}}
        name="website"
        label="Website"
      />
      <CustomInput
        control={control}
        rules={{
          required: 'Bio is Required',
          maxLength: {
            value: 100,
            message: 'must not be longer than 100 characters',
          },
        }}
        name="bio"
        label="Bio"
        multiline
      />
      <Text onPress={handleSubmit(onSubmit)} style={styles.textButton}>
        {updateLoading ? 'Submitting...' : 'Submit'}
      </Text>
      <Text onPress={confirmDelete} style={styles.textButtonDanger}>
        {deleteLoading ? 'Deleting...' : 'DELETE USER'}
      </Text>
    </View>
  );
};

export default EditProfileScreen;
