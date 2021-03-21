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
        gallery {
          url
          formats
        }
        categories{
          id
          title
          slug
        }
        Color{
          value
          stock
          Image{
            url
            formats
          }
        }
      }
      hasMore
    }
  }
`;
