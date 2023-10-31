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

import {useEffect, useState} from 'react';
import DoublePressable from '../DoublePressable';
import Carousel from '../Carousel';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';
import {Post} from '../../API';
import {DEFAULT_USER_IMAGE} from '../../config';
import PostMenu from './PostMenu';

import useLikeService from '../../services/LikeService';
import Content from './Content';
import {Storage} from 'aws-amplify';
import UserImage from '../UserImage';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
  const dayjs = require('dayjs');
  const relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  const [isExpanded, setIsExpanded] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const {post, isVisible = false} = props;

  const {toggleLike, isLiked} = useLikeService(post);

  const postLikes = post.Likes?.items.filter(like => !like?._deleted) || [];

  const navigation = useNavigation<FeedNavigationProp>();

  useEffect(() => {
    if (post?.User?.image) {
      Storage.get(post.User.image).then(setImageUri);
    }
  }, [post]);

  const navigateToUser = () => {
    if (post.User) {
      navigation.navigate('UserProfile', {userId: post.User?.id});
    }
  };

  const navigateToComments = () => {
    navigation.navigate('Comments', {postId: post.id});
  };

  const navigateToPostLikes = () => {
    navigation.navigate('PostLikes', {id: post.id});
  };

  const toggleDescription = () => {
    setIsExpanded(e => !e);
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

  // console.log(post);

  return (
    <View style={styles.post}>
      {/* Header */}
      <View style={styles.header}>
        <UserImage imageKey={post?.User?.image || undefined} />
        {/* <Image
          source={{uri: imageUri || DEFAULT_USER_IMAGE}}
          style={styles.userAvatar}
        /> */}
        <Text onPress={navigateToUser} style={styles.userName}>
          {post.User?.username}
        </Text>
        <PostMenu post={post} />
      </View>
      {/* Content */}
      <DoublePressable onDoublePress={toggleLike}>
        <Content post={post} isVisible={isVisible} />
      </DoublePressable>

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

        {postLikes.length === 0 ? (
          <Text>Be the first to like this post</Text>
        ) : (
          <Text style={styles.text} onPress={navigateToPostLikes}>
            Liked by
            <Text style={styles.bold}> {postLikes[0]?.User?.username} </Text>
            {postLikes.length > 1 && (
              <>
                {' '}
                and <Text style={styles.bold}> {post.nofLikes - 1} others</Text>
              </>
            )}
          </Text>
        )}

        {/* Post Description */}

        <Text style={styles.text} numberOfLines={isExpanded ? 0 : 3}>
          <Text style={styles.bold}>{post?.User?.username} </Text>
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
        <Text>{dayjs(post.createdAt).fromNow()}</Text>
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
