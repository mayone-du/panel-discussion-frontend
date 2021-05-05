import { useQuery, useMutation } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import { DeleteForever, Check, Chat } from "@material-ui/icons";
import { useContext, useEffect } from "react";
import {
  GET_NORMAL_TOPICS,
  GET_TALKING_TOPICS,
  GET_CLOSED_TOPICS,
  UPDATE_TOPIC,
  DELETE_TOPIC,
} from "src/apollo/queries";
import { Layout } from "src/components/Layout/Layout";
import { TopicForm } from "src/components/TopicForm";
import { UserContext } from "src/contexts/UserContext";
import useSWR from "swr";
import { request } from "graphql-request";

const Index: React.FC = () => {
  const { isAdminLogin } = useContext(UserContext);

  // SWRで通常、進行中、完了のすべての項目の最新情報を取得
  const API_ENDPOINT = `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`;
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

  const fetcher = (query) => request(API_ENDPOINT, query);
  const {
    data: newNormalTopicsData,
    error: newNormalTopicsError,
    mutate: newNormalTopicMutate,
  } = useSWR(GET_NEW_NORMAL_TOPICS, fetcher);
  const {
    data: newTalkingTopicsData,
    error: newTalkingTopicsError,
    mutate: newTalkingTopicsMutate,
  } = useSWR(GET_NEW_TALKING_TOPICS, fetcher);
  const {
    data: newClosedTopicsData,
    error: newClosedTopicsError,
    mutate: newClosedTopicsMutate,
  } = useSWR(GET_NEW_CLOSED_TOPICS, fetcher);

  const allMutate = () => {
    newNormalTopicMutate();
    newTalkingTopicsMutate();
    newClosedTopicsMutate();
  };

  // 話題を項目ごとにすべて取得するQuery
  const {
    loading: normalTopicsLoading,
    error: normalTopicsError,
    data: normalTopicsData,
  } = useQuery(GET_NORMAL_TOPICS);
  const {
    loading: talkingTopicsLoading,
    error: talkingTopicsError,
    data: talkingTopicsData,
  } = useQuery(GET_TALKING_TOPICS);
  const {
    loading: closedTopicLoading,
    error: closedTopicError,
    data: closedTopicsData,
  } = useQuery(GET_CLOSED_TOPICS);

  // 話題の状況を更新するMutation
  const [updateTopic] = useMutation(UPDATE_TOPIC, {
    refetchQueries: [
      { query: GET_NORMAL_TOPICS },
      { query: GET_TALKING_TOPICS },
      { query: GET_CLOSED_TOPICS },
    ],
  });

  // 話題を削除するMutation
  const [deleteTopic] = useMutation(DELETE_TOPIC, {
    refetchQueries: [
      { query: GET_NORMAL_TOPICS },
      { query: GET_TALKING_TOPICS },
      { query: GET_CLOSED_TOPICS },
    ],
  });

  // 進行中の話題にするボタンを押したときの処理
  const handleTalking = async (topic) => {
    try {
      await updateTopic({
        variables: {
          id: topic.node.id,
          title: topic.node.title,
          isTalking: !topic.node.isTalking,
          isClosed: false,
        },
      });
      allMutate();
    } catch (error) {
      alert(error);
    }
  };

  // 話題を終了するボタンを押したときの処理
  const handleClosed = async (topic) => {
    try {
      await updateTopic({
        variables: {
          id: topic.node.id,
          title: topic.node.title,
          isTalking: false,
          isClosed: !topic.node.isClosed,
        },
      });
      allMutate();
    } catch (error) {
      alert(error);
    }
  };

  // 話題を削除するボタンを押したときの処理
  const handleDelete = async (topic) => {
    try {
      await deleteTopic({
        variables: {
          id: topic.node.id,
        },
      });
      allMutate();
    } catch (error) {
      alert(error);
    }
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

        <div className="flex">
          {/* 新規作成された話題の欄 */}
          <div className="w-2/3 border rounded shadow bg-gray-100 m-2">
            <h2 className="text-3xl text-center pt-2 pb-4 font-bold">Topics</h2>

            <div className="flex flex-wrap">
              {/* ローディング中 */}
              {normalTopicsLoading && (
                <div>
                  <CircularProgress />
                </div>
              )}

              {/* エラー時 */}
              {normalTopicsError && (
                <div className="text-3xl">{normalTopicsError}</div>
              )}

              {/* 正常時 */}
              {newNormalTopicsData &&
                newNormalTopicsData.allTopics.edges.map((topic, index) => {
                  return (
                    <div className="p-1 w-1/3" key={index}>
                      <div className="border rounded p-2 shadow-sm bg-gray-50 h-40 flex flex-col justify-between overflow-y-scroll">
                        <div className="text-lg">{topic.node.title}</div>
                        {isAdminLogin ? (
                          <div className="flex justify-around">
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleDelete(topic);
                              }}
                            >
                              削除
                              <DeleteForever />
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleClosed(topic);
                              }}
                            >
                              終了
                              <Check />
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleTalking(topic);
                              }}
                            >
                              話す
                              <Chat />
                            </Button>
                          </div>
                        ) : (
                          <div>AdminUser only</div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="w-1/3">
            {/* 現在の話題 */}
            <div className="pt-2 pb-4 px-2 m-2 shadow mb-4 border rounded bg-gray-100">
              <h2 className="text-3xl text-center pt-2 pb-4 font-bold">
                Talking
              </h2>

              {/* ローディング中 */}
              {talkingTopicsLoading && (
                <div>
                  <CircularProgress />
                </div>
              )}

              {/* エラー時 */}
              {talkingTopicsError && (
                <div className="text-3xl">{talkingTopicsError}</div>
              )}

              {/* 正常時 */}
              {newTalkingTopicsData &&
                newTalkingTopicsData.allTopics.edges.map(
                  (talkingTopic, index) => {
                    return (
                      <div
                        className="border bg-gray-50 rounded p-2"
                        key={index}
                      >
                        <h3 className="text-xl font-bold pb-2">
                          {talkingTopic.node.title}
                        </h3>
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleClosed(talkingTopic);
                            }}
                          >
                            終了
                            <Check />
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>

            {/* 話し終えた話題の欄 */}
            <div className="pt-2 pb-4 px-2 m-2 shadow mb-4 border rounded bg-gray-100">
              <h2 className="text-3xl text-center pt-2 pb-4 font-bold">
                Closed
              </h2>

              {/* ローディング中 */}
              {closedTopicLoading && (
                <div>
                  <CircularProgress />
                </div>
              )}

              {/* エラー時 */}
              {closedTopicError && (
                <div className="text-3xl">{closedTopicError}</div>
              )}

              {/* 正常時 */}
              {newClosedTopicsData &&
                newClosedTopicsData.allTopics.edges.map(
                  (closedTopic, index) => {
                    return (
                      <div className="border bg-gray-50 p-2 my-2" key={index}>
                        <h3 className="text-lg">{closedTopic.node.title}</h3>
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleDelete(closedTopic);
                            }}
                          >
                            削除
                            <DeleteForever />
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
