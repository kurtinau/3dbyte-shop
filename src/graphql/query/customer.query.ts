import { gql } from '@apollo/client';

export const GET_LOGGED_IN_CUSTOMER = gql`
  query getMe {
    me {
      user{
        id
        username
        email
        firstName
        lastName
        addresses {
          id
          line1
          line2
          suburb
          state
          postcode
          pid
          sla
          isPrimary
        }
        cards {
          id
          type
          cardType
          name
          lastFourDigit
        }
        contacts {
          id
          firstName
          lastName
          phone
          isPrimary
        }
      }
    }
  }
`;

