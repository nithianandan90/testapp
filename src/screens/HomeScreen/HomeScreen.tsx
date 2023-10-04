import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
  ViewabilityConfig,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import FeedPost from '../../components/FeedPosts/FeedPost';
import posts from '../../assets/data/post.json';
import {useQuery} from '@apollo/client';
import {listPosts} from './queries';
import {ListPostsQuery, ListPostsQueryVariables} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {API, graphqlOperation} from 'aws-amplify';

const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const {data, loading, error, refetch} = useQuery<
    ListPostsQuery,
    ListPostsQueryVariables
  >(listPosts);
  // const [posts, setPosts] = useState([]);

  // const fetchPosts = async () => {
  //   const response = await API.graphql(graphqlOperation(listPosts));
  //   setPosts(response.data.listPosts.items);
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 51,
  };

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      console.log('changed');

      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    },
  );

  console.log(data);
  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return (
      <ApiErrorMessage
        title="Error fethching posts"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  const posts = data?.listPosts?.items || [];

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({item}) =>
          item && <FeedPost post={item} isVisible={activePostId === item.id} />
        } // {item}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onRefresh={() => refetch()}
        refreshing={loading}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
