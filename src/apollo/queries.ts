import { gql } from "@apollo/client";

export const GET_TOKENS = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

export const REFRESH_TOKENS = gql`
  mutation($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

export const GET_ALL_TOPICS = gql`
  query {
    allTopics {
      edges {
        node {
          id
          title
          isTalking
          isClosed
        }
      }
    }
  }
`;


export const GET_TALKING_TOPIC = gql`
  query {
    allTopics(isTalking: true) {
      edges {
        node {
          id
          title
          isTalking
          isClosed
        }
      }
    }
  }
`;


export const CREATE_TOPIC = gql`
  mutation($title: String!) {
    createTopic(input: { title: $title }) {
      topic {
        id
        title
      }
    }
  }
`;

export const UPDATE_TOPIC = gql`
  mutation($id: ID!, $title: String!, $isTalking: Boolean!, $isClosed: Boolean!) {
    updateTopic(
      input: { id: $id, title: $title, isTalking: $isTalking, isClosed: $isClosed }
    ) {
      topic {
        id
        title
        isTalking
        isClosed
      }
    }
  }
`;
