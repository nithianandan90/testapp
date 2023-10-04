import {StyleSheet} from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';

export default StyleSheet.create({
  root: {
    padding: 10,
  },
  headerRow: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
  numberContainer: {
    alignItems: 'center',
  },
  numberText: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.full,
    color: colors.black,
  },
  name: {
    fontWeight: fonts.weight.full,
    color: colors.black,
    marginVertical: 10,
  },
});
