import { gql } from "@apollo/client";

export const UPDATE_ADDRESS = gql`
  mutation ($addressInput: updateAddressInput!) {
    updateAddress(input: $addressInput) {
      address {
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
    }
  }
`;
export const DELETE_ADDRESS = gql`
  mutation ($input: deleteAddressInput!) {
    deleteAddress(input: $input) {
      address{
        id
      }
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation ($addressInput: createAddressInput!) {
    createAddress(input: $addressInput) {
      address {
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
    }
  }
`;

export const SET_ADDRESS_PRIMARY = gql`
  mutation ($input: deleteAddressInput!) {
    setAddressPrimary(input: $input) {
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
  }
`;
