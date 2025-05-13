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

export const GET_SETTING = gql`
  query getSetting {
    getSetting {
      sendEmails
      generateSignals
      executeOrders
      aiProvider
      aiModel
      effort
      maxTokens
      startTime
      email
      includeBalances
      includeLiveData
    }
  }
`;

export const ADD_SETTING = gql`
  mutation AddSetting($input: AddSettingInput!) {
    addSetting(input: $input) {
      sendEmails
      generateSignals
      executeOrders
      aiProvider
      aiModel
      effort
      maxTokens
      startTime
      includeBalances
      includeLiveData
    }
  }
`;

export const UPDATE_SETTING = gql`
  mutation UpdateSetting($input: UpdateSettingInput!) {
    updateSetting(input: $input)
  }
`;

export const IS_CREDENTIALS_EXISTS = gql`
  query isCredentialsExists {
    isCredentialsExists
  }
`;

export const ADD_CREDENTIALS = gql`
  mutation AddCredentials($input: AddCredentialsInput!) {
    addCredentials(input: $input)
  }
`;

export const DELETE_CREDENTIALS = gql`
  mutation deleteCredentials {
    deleteCredentials
  }
`;
