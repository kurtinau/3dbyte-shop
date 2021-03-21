import { gql } from '@apollo/client';

export const UPDATE_ME = gql`
  mutation($meInput:updateUserInput) {
    updateUser(input: $meInput) {
      user{
        id
        username
        email
      }
    }
  }
`;
