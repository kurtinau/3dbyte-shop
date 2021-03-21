import React from 'react';
import { ProductCard } from 'components/product-card/product-card-four';
import styled from 'styled-components';
import css from '@styled-system/css';
import ErrorMessage from 'components/error-message/error-message';
import { useQuery, NetworkStatus } from '@apollo/client';
import { GET_PRODUCTS } from 'graphql/query/products.query';
import { useRouter } from 'next/router';
import { Button } from 'components/button/loadmore-button';
import { FormattedMessage } from 'react-intl';
import { Box } from 'components/box';
import NoResultFound from 'components/no-result/no-result';
import { LoaderItem, LoaderWrapper } from './product-list/product-list.style';
import Placeholder from 'components/placeholder/placeholder';

// import { Button } from './button';

const Grid = styled.div(
  css({
    display: 'grid',
    gridGap: '10px',
    gridTemplateColumns: 'repeat(1, minmax(180px, 1fr))',

    '@media screen and (min-width: 440px)': {
      gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
      gridGap: '20px',
    },

    '@media screen and (min-width: 991px)': {
      gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
      gridGap: '30px',
    },

    '@media screen and (min-width: 1100px)': {
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    },

    '@media screen and (min-width: 1700px)': {
      gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))',
    },

    '@media screen and (min-width: 2200px)': {
      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
    },
  })
);

interface Props {
  loadMore?: boolean;
  fetchLimit?: number;
  style?: any;
  deviceType?: any;
}

export const ProductGrid = ({
  style,
  loadMore = true,
  fetchLimit = 3,
  // fetchLimit = 16,
  deviceType
}: Props) => {
  const router = useRouter();
  const queryText = router.query.text;
  const queryCategory = router.query.category;
  let whereVariable;
  if (queryCategory) {
    whereVariable = {
      where: { categories: { slug: queryCategory } }
    };
  } else if (queryText) {
    whereVariable = {
      where: { title_contains: queryText }
    }
  }
  const { data, error, loading, fetchMore, networkStatus } = useQuery(
    GET_PRODUCTS,
    {
      variables: {
        // text: router.query.text,
        // category: { slug: router.query.category },
        start: 0,
        limit: fetchLimit,
        ...whereVariable
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  if (error) return <ErrorMessage message={error.message} />;
  if (loading && !loadingMore) {
    return (
      <LoaderWrapper>
        <LoaderItem>
          <Placeholder uniqueKey='1' />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey='2' />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey='3' />
        </LoaderItem>
      </LoaderWrapper>
    );
  }
  if (!data || !data.productsWithHasMore || data.productsWithHasMore.items.length === 0) {
    return <NoResultFound />;
  }
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        start: Number(data.productsWithHasMore.items.length),
        limit: 10,
      },
    });
  };
  const { items, hasMore } = data.productsWithHasMore;
  return (
    <section>
      <Grid style={style}>
        {items.map((product, idx) => {
          let productWithImage = { image: [] };
          if (product.gallery.length <= 0 && product.Color.length > 0) {
            product.Color.map(item => {
              const imageFormats = item.Image[0].formats;
              const originalUrl = item.Image[0].url;
              productWithImage.image.push({
                "thumbnail": imageFormats.thumbnail ? imageFormats.thumbnail.url : originalUrl,
                "large": imageFormats.large ? imageFormats.large.url : originalUrl,
                "medium": imageFormats.medium ? imageFormats.medium.url : originalUrl,
                "small": imageFormats.small ? imageFormats.small.url : originalUrl,
                url: originalUrl
              });
            });
          } else if (product.Color.length <= 0 && product.gallery.length > 0) {
            product.gallery.map(item => {
              const imageFormats = item.formats;
              const originalUrl = item.url;
              productWithImage.image.push({
                "thumbnail": imageFormats.thumbnail ? imageFormats.thumbnail.url : originalUrl,
                "large": imageFormats.large ? imageFormats.large.url : originalUrl,
                "medium": imageFormats.medium ? imageFormats.medium.url : originalUrl,
                "small": imageFormats.small ? imageFormats.small.url : originalUrl,
                url: originalUrl
              });
            });
          }
          productWithImage = Object.assign(productWithImage, product);
          return <ProductCard data={productWithImage} key={product.id} deviceType={deviceType} />;
        }
        )}
      </Grid>

      {loadMore && hasMore && (
        <Box style={{ textAlign: 'center' }} mt={'2rem'}>
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant='secondary'
            style={{
              fontSize: 14,
              display: 'inline-flex',
            }}
            border='1px solid #f1f1f1'
          >
            <FormattedMessage id='loadMoreButton' defaultMessage='Load More' />
          </Button>
        </Box>
      )}
    </section>
  );
};
