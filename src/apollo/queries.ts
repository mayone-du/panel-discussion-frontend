import { gql } from "@apollo/client";

export const GET_AUTH_TOKEN = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
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
