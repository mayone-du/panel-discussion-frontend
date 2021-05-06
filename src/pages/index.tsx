import { useEffect } from "react";
import { Layout } from "src/components/Layout/Layout";
import { TopicForm } from "src/components/Topics/TopicForm";
import useSWR from "swr";
import { request } from "graphql-request";
import { NormalTopics } from "src/components/Topics/NormalTopics";
import { TalkingTopics } from "src/components/Topics/TalkingTopics";
import { ClosedTopics } from "src/components/Topics/ClosedTopics";
import { Chats } from "src/components/Chats";

const Index: React.FC = () => {
  // SWRで通常、進行中、完了のすべての項目の最新情報を取得
  const API_ENDPOINT =
    process.env.NODE_ENV === "production"
      ? `${process.env.API_ENDPOINT}`
      : `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`;
  const GET_NEW_NORMAL_TOPICS = `query {
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
  }`;
  const GET_NEW_TALKING_TOPICS = `query {
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
  }`;
  const GET_NEW_CLOSED_TOPICS = `query {
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
  }`;
  const GET_NEW_ALL_COMMENTS = `query {
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
  }`;

  const fetcher = (query) => request(API_ENDPOINT, query);
  const {
    // data: newNormalTopicsData,
    // error: newNormalTopicsError,
    mutate: newNormalTopicMutate,
  } = useSWR(GET_NEW_NORMAL_TOPICS, fetcher);
  const {
    // data: newTalkingTopicsData,
    // error: newTalkingTopicsError,
    mutate: newTalkingTopicsMutate,
  } = useSWR(GET_NEW_TALKING_TOPICS, fetcher);
  const {
    // data: newClosedTopicsData,
    // error: newClosedTopicsError,
    mutate: newClosedTopicsMutate,
  } = useSWR(GET_NEW_CLOSED_TOPICS, fetcher);
  const {
    // data: newAllCommentsData,
    // error: newAllCommentsError,
    mutate: newAllCommentsMutate,
  } = useSWR(GET_NEW_ALL_COMMENTS, fetcher);

  const allMutate = () => {
    newNormalTopicMutate();
    newTalkingTopicsMutate();
    newClosedTopicsMutate();
    newAllCommentsMutate();
  };

  useEffect(() => {
    allMutate();
  }, []);

  return (
    <>
      <Layout>
        <div className="flex justify-center py-4">
          <TopicForm allMutate={allMutate} />
        </div>

        <div className="md:flex w-full">
          {/* 新規作成された話題 */}

          <NormalTopics allMutate={allMutate} />

          <div className="md:w-3/5 md:flex">
            <div className="md:w-1/2">
              {/* 現在の話題 */}
              <TalkingTopics allMutate={allMutate} />

              {/* 話し終えた話題 */}
              <ClosedTopics allMutate={allMutate} />
            </div>
            <div className="md:w-1/2">
              {/* チャット */}
              <Chats allMutate={allMutate} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
