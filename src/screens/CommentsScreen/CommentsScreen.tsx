import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Comment from '../../components/Comments';
import Input from './input';
import {useMutation, useQuery, useSubscription} from '@apollo/client';
import {
  commentsForPost,
  onCreateComment,
  onCreateCommentByPostId,
} from './queries';
import {CommentsRouteProp} from '../../types/navigation';
import {useRoute} from '@react-navigation/native';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {
  Comment as CommentType,
  CommentsForPostQuery,
  CommentsForPostQueryVariables,
  ModelSortDirection,
  OnCreateCommentByPostIdSubscription,
  OnCreateCommentByPostIdSubscriptionVariables,
  OnCreateCommentSubscription,
} from '../../API';

const CommentsScreen = () => {
  const route = useRoute<CommentsRouteProp>();

  const postId = route.params.postId;

  const [newComments, setNewComments] = useState<CommentType[]>([]);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  //query all the comments for the screen and display
  const {data, loading, error, fetchMore} = useQuery<
    CommentsForPostQuery,
    CommentsForPostQueryVariables
  >(commentsForPost, {
    variables: {
      postID: postId,
      sortDirection: ModelSortDirection.DESC,
      limit: 3,
    },
  });

  const {data: newCommentsData} = useSubscription<
    OnCreateCommentByPostIdSubscription,
    OnCreateCommentByPostIdSubscriptionVariables
  >(onCreateCommentByPostId, {variables: {postID: postId}});

  // console.log(newCommentsData);

  const comments =
    data?.commentsForPost?.items.filter(comment => !comment?._deleted) || [];

  // const {data: newCommentsData} = useSubscription<
  //   OnCreateCommentByPostIdSubscription,
  //   OnCreateCommentByPostIdSubscriptionVariables
  // >(onCreateCommentByPostId, {variables: {postID: postId}});

  useEffect(() => {
    if (newCommentsData?.onCreateCommentByPostId) {
      console.log(
        'new comment',
        JSON.stringify(newCommentsData?.onCreateCommentByPostId, null, 2),
      );

      setNewComments(comments => [
        ...comments,
        newCommentsData.onCreateCommentByPostId as CommentType,
      ]);
    }
  }, [newCommentsData]);

  const nextToken = data?.commentsForPost?.nextToken;

  const loadMore = async () => {
    console.log('loading more', nextToken);

    if (!nextToken || isFetchingMore) {
      return;
    }

    setIsFetchingMore(true);

    const response = await fetchMore({variables: {nextToken}});

    // console.log(
    //   'response',
    //   JSON.stringify(response?.data?.commentsForPost?.items, null, 2),
    // );

    setIsFetchingMore(false);
  };

  const isNewComment = (comment: CommentType) => {
    console.log(
      comment,
      newComments.some(c => c.id === comment.id),
    );
    return newComments.some(c => c.id === comment.id);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return (
      <ApiErrorMessage
        title="Error fethching comments"
        message={error.message}
        // onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[...newComments, ...comments] || []}
        renderItem={({item}) => {
          if (!item) {
            return null;
          } else {
            return (
              <Comment
                comment={item}
                includeDetails
                isNew={isNewComment(item)}
              />
            );
          }
        }}
        style={{padding: 10}}
        refreshing={loading}
        inverted
        ListEmptyComponent={() => <Text>No comments yet</Text>}
        // ListFooterComponent={() => (
        //   <Text style={{padding: 10}} onPress={loadMore}>
        //     Load More
        //   </Text>
        // )}
        onEndReached={() => {
          loadMore();
        }}
      />
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({});
