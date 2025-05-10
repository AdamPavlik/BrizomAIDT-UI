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
  mutation UpdateCoin($input: UpdateCoinInput!) {
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

export const GET_PROMPTS = gql`
  query getPrompts {
    getPrompts {
      id
      prompt
      role
      enabled
    }
  }
`;

export const ADD_PROMPT = gql`
  mutation AddPrompt($input: AddPromptInput!) {
    addPrompt(input: $input) {
      id
      userId
      prompt
      role
      enabled
    }
  }
`;

export const DELETE_PROMPT = gql`
  mutation DeletePrompt($input: DeletePromptInput!) {
    deletePrompt(input: $input)
  }
`;


export const UPDATE_PROMPT = gql`
  mutation UpdatePrompt($input: UpdatePromptInput!) {
    updatePrompt(input: $input)
  }
`;
