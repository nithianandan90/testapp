import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  Camera,
  CameraPictureOptions,
  CameraRecordingOptions,
  FlashMode,
} from 'expo-camera';
import colors from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {CameraNavigationProp} from '../../types/navigation';
import {launchImageLibrary} from 'react-native-image-picker';

const flashModes = [
  FlashMode.off,
  FlashMode.on,
  FlashMode.auto,
  FlashMode.torch,
];

const flashModeToIcon = {
  [FlashMode.off]: 'flash-off',
  [FlashMode.on]: 'flash-on',
  [FlashMode.auto]: 'flash-auto',
  [FlashMode.torch]: 'highlight',
};

const CameraScreen = () => {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const camera = useRef<Camera>(null);

  const inset = useSafeAreaInsets();

  const isFocused = useIsFocused();

  const navigation = useNavigation<CameraNavigationProp>();

  useEffect(() => {
    const getPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();

      setHasPermissions(
        cameraPermission.status === 'granted' &&
          microphonePermission.status === 'granted',
      );
    };
    getPermission();
  }, []);

  const flipCamera = () => {
    setCameraType(currentCameraType =>
      currentCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const flipFlash = () => {
    const currentIndex = flashModes.indexOf(flash);
    const nextIndex =
      currentIndex === flashModes.length - 1 ? 0 : currentIndex + 1;
    setFlash(flashModes[nextIndex]);
  };

  const takePicture = async () => {
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }

    const options: CameraPictureOptions = {
      quality: 0.5,
      base64: true,
      skipProcessing: true,
    };

    const result = await camera.current.takePictureAsync(options);
    navigation.navigate('Create', {
      image: result.uri,
    });
  };

  const startRecording = async () => {
    console.warn('start recording');
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }

    const options: CameraRecordingOptions = {
      quality: Camera.Constants.VideoQuality['640:480'],
      maxDuration: 60,
      maxFileSize: 10 * 1024 * 1024,
      mute: false,
    };

    setIsRecording(true);

    try {
      const result = await camera.current?.recordAsync(options);
      console.log(result);
    } catch (e) {
      console.log(e);
    }

    setIsRecording(false);
  };

  const stopRecording = () => {
    console.warn('stop recording');
    if (isRecording) {
      camera.current?.stopRecording();
      setIsRecording(false);
    }
  };

  const navigateToCreateScreen = () => {};

  const openImageGallery = () => {
    launchImageLibrary(
      {mediaType: 'mixed', selectionLimit: 3},
      ({didCancel, errorCode, errorMessage, assets}) => {
        const params: {image?: string; images?: string[]; video?: string} = {};

        if (!didCancel && !errorCode && assets && assets.length > 0) {
          if (assets.length === 1) {
            if (assets[0].type?.startsWith('video')) {
              params.video = assets[0].uri;
            } else {
              params.image = assets[0].uri;
            }
          } else if (assets.length > 1) {
            params.images = assets.map(asset => asset.uri as string);
          }

          navigation.navigate('Create', params);
        }
      },
    );
  };

  if (hasPermissions === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermissions === false) {
    return <Text>No access to the camera</Text>;
  }
  return (
    <View style={styles.page}>
      {isFocused && (
        <Camera
          ref={camera}
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
          onCameraReady={() => setIsCameraReady(true)}
        />
      )}
      <View style={[styles.buttonsContainer, {top: inset.top + 25}]}>
        <MaterialIcons name="close" size={30} color={colors.white} />
        <Pressable onPress={flipFlash}>
          <MaterialIcons
            name={flashModeToIcon[flash]}
            size={30}
            color={colors.white}
          />
        </Pressable>

        <MaterialIcons name="settings" size={30} color={colors.white} />
      </View>
      <View style={[styles.buttonsContainer, {bottom: 25}]}>
        <Pressable onPress={openImageGallery}>
          <MaterialIcons name="photo-library" size={30} color={colors.white} />
        </Pressable>

        {isCameraReady && (
          <Pressable
            onPress={takePicture}
            // onLongPress={startRecording}
            // onPressOut={stopRecording}
          >
            <View
              style={[
                styles.circle,
                {backgroundColor: isRecording ? colors.red : colors.white},
              ]}
            />
          </Pressable>
        )}
        <Pressable onPress={flipCamera}>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color={colors.white}
          />
        </Pressable>
        {/* <Pressable onPress={navigateToCreateScreen}>
          <MaterialIcons
            name="arrow-forward-ios"
            size={30}
            color={colors.white}
          />
        </Pressable> */}
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
  },
  circle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
});
