import { StyleSheet } from "react-native";
import fonts from "../../theme/fonts";
import colors from "../../theme/colors";

export default StyleSheet.create({
    post: {
  
    },
    image: {
      width: '100%',
      aspectRatio: 1
    },
    header:{
      flexDirection: 'row',
      alignItems: 'center', 
      padding: 10
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10
    },
    userName: {
      fontWeight: fonts.weight.bold,
      color: colors.black
    },
    threeDots: {
      marginLeft:'auto'
    },
    iconContainer: {
      flexDirection: 'row',
     
      marginBottom: 5
    },
    icon: {
      marginHorizontal: 5
    },
    footer: {
      padding: 10
    },
    bold: {
      fontWeight:fonts.weight.bold
    },
    text: {
      color: colors.black,
      lineHeight: 18
    },
    comment: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentText: {
      flex: 1
    }
  })