import { gql } from '@apollo/client';

export const GET_PRODUCT_WITH_RELATED_PRODUCTS = gql`
  query getProductWithRelatedProducts($slug: String!, $type: String!) {
    product(slug: $slug) {
      id
      title
      weight
      slug
      price
      type
      image
      categories {
        id
        slug
        title
      }
    }
    relatedProducts(slug: $slug, type: $type) {
      id
      title
      slug
      weight
      price
      type
      image
    }
  }
`;

export const GET_RELATED_PRODUCTS = gql`
  query getRelatedProducts($type: String!, $slug: String!) {
    relatedProducts(type: $type, slug: $slug) {
      id
      title
      slug
      weight
      price
      type
      image
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProduct($where: JSON!) {
    product(where: $where) {
      id
      title
      slug
      price
      discountInPercent
      gallery {
        url
      }
      image
      categories {
        id
        slug
        title
      }
    }
  }
`;
export const GET_PRODUCT_DETAILS = gql`
  query getProduct($where: JSON!) {
    productByUID(where: $where) {
      id
      slug
      title
      price
      salePrice
      shortDescription
      description
      discountInPercent
      gallery {
        url
        formats
      }
      Color{
        id
        value
        stock
        Image{
          url
          formats
        }
      }
      categories {
        id
        slug
        title
      }
    }
  }
`;
