import React from 'react';
import CustomButton from '../CustomButton';
import {Auth} from 'aws-amplify';
import {Alert} from 'react-native';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';

const SocialSignInButtons = () => {
  const onSignInFacebook = async () => {
    // console.warn('onSignInFacebook');
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Facebook,
      });
    } catch (e) {
      Alert.alert('Oops,', (e as Error).message);
    }
  };

  const onSignInGoogle = async () => {
    // console.warn('onSignInGoogle');
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      });
    } catch (e) {
      Alert.alert('Oops,', (e as Error).message);
    }
  };

  const onSignInApple = () => {
    console.warn('onSignInApple');
  };

  return (
    <>
      <CustomButton
        text="Sign In with Facebook"
        onPress={onSignInFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
      />
    </>
  );
};

export default SocialSignInButtons;
