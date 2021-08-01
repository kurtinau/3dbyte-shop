import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query getProducts(
    $start: Int
    $limit: Int
    $where: JSON
  ) {
    productsWithHasMore(
      start: $start
      limit: $limit
      where: $where
    ) {
      items {
        id
        title
        slug
        price
        salePrice
        description
        shortDescription
        discountInPercent
        weight
        length_
        width
        height
        gallery {
          url
          formats
        }
        categories{
          id
          title
          slug
        }
        variants{
          __typename
          ... on ComponentVariantColor{
            value
            stock
            image {
              url
              formats
            }
          }
          ... on ComponentVariantSize{
            value
            width
            length_
            height
            weight
            stock
          }
        }

      }
      hasMore
    }
  }
`;
