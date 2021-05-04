import { gql } from "@apollo/client";

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
