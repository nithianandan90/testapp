import {Pressable, Text, View} from 'react-native';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Comment from '../Comments';

import {useState} from 'react';
import DoublePressable from '../DoublePressable';
import Carousel from '../Carousel';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';
import {Post} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = ({post, isVisible}: IFeedPost) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const navigation = useNavigation<FeedNavigationProp>();

  const navigateToUser = () => {
    if (post.User) {
      navigation.navigate('UserProfile', {userId: post.User?.id});
    }
  };

  const navigateToComments = () => {
    navigation.navigate('Comments', {postId: post.id});
  };

  const toggleDescription = () => {
    setIsExpanded(e => !e);
  };

  const toggleLike = () => {
    setIsLiked(f => !f);
  };

  let lastTap = 0;

  const handleDoublePress = () => {
    console.log(lastTap);
    const now = Date.now(); //timestamp
    if (now - lastTap < 300) {
      toggleLike();
    }

    lastTap = now;
  };

  let content = null;
  if (post.image) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <Image source={{uri: post.image}} style={styles.image} />
      </DoublePressable>
    );
  } else if (post.images) {
    content = <Carousel images={post.images} onDoublePress={toggleLike} />;
  } else if (post.video) {
    content = (
      <DoublePressable onDoublePress={toggleLike}>
        <VideoPlayer uri={post.video} paused={!isVisible} />
      </DoublePressable>
    );
  }

  return (
    <View style={styles.post}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{uri: post.User?.image || DEFAULT_USER_IMAGE}}
          style={styles.userAvatar}
        />
        <Text onPress={navigateToUser} style={styles.userName}>
          {post.User.username}
        </Text>
        <Entypo
          name="dots-three-horizontal"
          size={16}
          style={styles.threeDots}
        />
      </View>
      {/* Content */}
      {content}
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <AntDesign
            onPress={toggleLike}
            name={isLiked ? 'heart' : 'hearto'}
            size={24}
            style={styles.icon}
            color={isLiked ? colors.red : colors.black}
          />
          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{marginLeft: 'auto'}}
            color={colors.black}
          />
        </View>
        <Text style={styles.text}>
          Liked by
          <Text style={styles.bold}> Dhevia </Text>
          and
          <Text style={styles.bold}> {post.nofLikes} others</Text>
        </Text>
        {/* Post Description */}

        <Text style={styles.text} numberOfLines={isExpanded ? 0 : 3}>
          <Text style={styles.bold}>{post.User.username} </Text>
          {post.description}
        </Text>
        <Text onPress={toggleDescription}>{isExpanded ? 'less' : 'more'}</Text>

        {/*Comments*/}
        <Text onPress={navigateToComments}>
          View all {post.nofComments} comments
        </Text>

        {(post.Comments?.items || []).map(
          comment => comment && <Comment key={comment.id} comment={comment} />,
        )}

        {/* Posted date */}
        <Text>{post.createdAt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {},
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: fonts.weight.bold,
    color: colors.black,
  },
  threeDots: {
    marginLeft: 'auto',
  },
  iconContainer: {
    flexDirection: 'row',

    marginBottom: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  footer: {
    padding: 10,
  },
  bold: {
    fontWeight: fonts.weight.bold,
  },
  text: {
    color: colors.black,
    lineHeight: 18,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    flex: 1,
  },
});

export default FeedPost;
