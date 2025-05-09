import {gql} from '@apollo/client/core';

export const GET_COINS = gql`
      query getCoins {
        getCoins {
          id
          symbol
          executeOrder
          generateSignal
          sendEmail
        }
      }
    `;

export const UPDATE_COIN = gql`
  mutation PutCoin($input: UpdateCoinInput!) {
    updateCoin(input: $input)
  }
`;

export const ADD_COIN = gql`
  mutation AddCoin($input: AddCoinInput!) {
    addCoin(input: $input) {
      id
      symbol
      userId
      generateSignal
      sendEmail
      executeOrder
    }
  }
`;

export const DELETE_COIN = gql`
  mutation DeleteCoin($input: DeleteCoinInput!) {
    deleteCoin(input: $input)
  }
`;
