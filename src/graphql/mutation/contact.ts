import { gql } from "@apollo/client";

export const UPDATE_CONTACT = gql`
  mutation updateContact($contactInput: updateContactInput!) {
    updateContact(input: $contactInput) {
      contact {
        id
        firstName
        lastName
        isPrimary
        phone
      }
    }
  }
`;
export const DELETE_CONTACT = gql`
  mutation ($input: deleteContactInput!) {
    deleteContact(input: $input) {
      contact {
        id
      }
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation ($contactInput: createContactInput!) {
    createContact(input: $contactInput) {
      contact {
        id
        firstName
        lastName
        isPrimary
        phone
      }
    }
  }
`;

export const SET_CONTACT_PRIMARY = gql`
  mutation ($input: deleteContactInput!) {
    setContactPrimary(input: $input) {
      id
      firstName
      lastName
      phone
      isPrimary
    }
  }
`;
