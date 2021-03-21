import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      id
      title
      slug
      icon
      children {
        id
        title
        slug
      }
    }
  }
`;

export const GET_CATEGORIES_TREE = gql`
query getCategoriesTress{
  categoriesTree(where:{icon_null: false}){
      id
      title
      slug
      icon
      children {
        id
        title
        slug
      }
  }
}
`;
