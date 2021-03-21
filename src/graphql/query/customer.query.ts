import { gql } from '@apollo/client';

export const GET_LOGGED_IN_CUSTOMER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      addresses {
        id
        type
        name
        info
      }
      cards {
        id
        type
        cardType
        name
        lastFourDigit
      }
    }
  }
`;
