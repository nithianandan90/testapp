import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

import FeedGridItem from './FeedGridItem';
import {Post} from '../../API';

interface IFeedGridView {
  data: (Post | null)[];
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  refetch: () => void;
  loading: boolean;
}

const FeedGridView = ({
  data,
  ListHeaderComponent,
  refetch,
  loading,
}: IFeedGridView) => {
  console.log('loading', loading);

  return (
    <FlatList
      data={data}
      renderItem={({item}) => item && <FeedGridItem post={item} />}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      style={{marginHorizontal: -1}}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    />
  );
};

export default FeedGridView;

const styles = StyleSheet.create({});
