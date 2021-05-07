import { gql } from "@apollo/client";

export const GET_TOKENS = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

export const ALL_TOKEN_REFRESH = gql`
  mutation($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

export const GET_NORMAL_TOPICS = gql`
  query {
    allTopics(isTalking: false, isClosed: false) {
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

export const GET_TALKING_TOPICS = gql`
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

export const GET_CLOSED_TOPICS = gql`
  query {
    allTopics(isClosed: true) {
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

export const GET_ALL_COMMENTS = gql`
  query {
    allComments {
      edges {
        node {
          id
          text
          nickname
          createdAt
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
  mutation(
    $id: ID!
    $title: String!
    $isTalking: Boolean!
    $isClosed: Boolean!
  ) {
    updateTopic(
      input: {
        id: $id
        title: $title
        isTalking: $isTalking
        isClosed: $isClosed
      }
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

export const DELETE_TOPIC = gql`
  mutation($id: ID!) {
    deleteTopic(input: { id: $id }) {
      topic {
        id
        title
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation($text: String!, $nickname: String) {
    createComment(input: { text: $text, nickname: $nickname }) {
      comment {
        id
        text
        nickname
        createdAt
      }
    }
  }
`;
