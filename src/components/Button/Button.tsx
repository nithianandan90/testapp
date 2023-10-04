import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';

interface IButton {
  text?: string;
  onPress?: () => void;
  inline?: boolean;
}

const Button = ({text = '', onPress = () => {}, inline}: IButton) => {
  return (
    <Pressable
      style={[styles.container, inline ? {flex: 1} : {}]}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',

    margin: 5,
  },
  text: {
    color: colors.black,
    fontWeight: fonts.weight.small,
  },
});
