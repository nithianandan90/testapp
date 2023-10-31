import {useMutation, useQuery} from '@apollo/client';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {createComment, getPost, updatePost} from './queries';
import {Alert} from 'react-native';
import {useAuthContext} from '../../contexts/AuthContext';

const useCommentsService = (postId: string) => {
  const {userId} = useAuthContext();

  const {data: postData} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {variables: {id: postId}},
  );

  const post = postData?.getPost;

  const [doUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const [doCreateComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment);

  const incrementNofComments = (amount: 1 | -1) => {
    if (!post) {
      Alert.alert('Failed to load post');
      return;
    }

    doUpdatePost({
      variables: {
        input: {
          id: post.id,
          _version: post._version,
          nofComments: post.nofComments + amount,
        },
      },
    });
  };

  const onCreateComment = (newComment: string) => {
    if (!post) {
      Alert.alert('Failed to load post');
      return;
    }
    try {
      doCreateComment({
        variables: {
          input: {comment: newComment, userID: userId, postID: post.id},
        },
      });
      incrementNofComments(1);
    } catch (e) {
      Alert.alert('Error submitting post', (e as Error).message);
    }

    // console.warn('Posting the comment', newComment);
  };

  return {
    incrementNofComments,
    onCreateComment,
  };
};

export default useCommentsService;
