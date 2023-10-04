import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';

interface IVideoPlayer {
  uri: string;
  paused: boolean;
}

const VideoPlayer = ({uri, paused}: IVideoPlayer) => {
  const [muted, setMuted] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');

  const onProgressUpdate = ({
    currentTime,
    seekableDuration,
  }: {
    currentTime: number;
    seekableDuration: number;
  }) => {
    const remainingSeconds = Math.floor(seekableDuration - currentTime);
    const minutes = Math.floor(remainingSeconds / 60);
    const secondsFormatted = (remainingSeconds % 60)
      .toString()
      .padStart(2, '0');

    setRemainingTime(`${minutes}:${secondsFormatted}`);
    // if (remainingSeconds - Math.floor(remainingSeconds / 60) < 10) {
    //   const addZero = '0';
    // } else {
    //   const addZero = '';
    // }

    // const formatted =
    //   Math.floor(remainingSeconds / 60) +
    //   ':' +
    //   (remainingSeconds - Math.floor(remainingSeconds / 60)).toFixed(0);
    // setRemainingTime(formatted);
  };

  return (
    <View>
      <Video
        source={{uri}}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted={muted}
        paused={paused}
        onProgress={onProgressUpdate}
      />

      <Pressable onPress={() => setMuted(v => !v)} style={styles.muteButton}>
        <Ionicons
          name={muted ? 'volume-mute' : 'volume-medium'}
          size={14}
          color="white"
        />
      </Pressable>
      <Text style={styles.time}>{remainingTime}</Text>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 1,
  },
  muteButton: {
    backgroundColor: colors.black,
    padding: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  time: {
    padding: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    fontWeight: '600',
    color: 'white',
  },
});
