import { useQuery, useMutation } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import { useContext, useEffect } from "react";
import {
  GET_NORMAL_TOPICS,
  GET_TALKING_TOPICS,
  GET_CLOSED_TOPICS,
  DELETE_TOPIC,
} from "src/apollo/queries";
import { UserContext } from "src/contexts/UserContext";
import useSWR from "swr";
import { request } from "graphql-request";

export const ClosedTopics: React.VFC = () => {
  const { isAdminLogin, isAdminEditMode } = useContext(UserContext);

  // SWRで最新情報を取得
  const API_ENDPOINT =
    process.env.NODE_ENV === "production"
      ? `${process.env.API_ENDPOINT}`
      : `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`;

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
    data: newClosedTopicsData,
    error: newClosedTopicsError,
    mutate: newClosedTopicsMutate,
  } = useSWR(GET_NEW_CLOSED_TOPICS, fetcher, { refreshInterval: 1000 });

  // 話題を項目ごとにすべて取得するQuery

  const {
    loading: closedTopicLoading,
    error: closedTopicError,
    // data: closedTopicsData,
  } = useQuery(GET_CLOSED_TOPICS);

  // 話題を削除するMutation
  const [deleteTopic] = useMutation(DELETE_TOPIC, {
    refetchQueries: [
      { query: GET_NORMAL_TOPICS },
      { query: GET_TALKING_TOPICS },
      { query: GET_CLOSED_TOPICS },
    ],
  });

  // 話題を削除するボタンを押したときの処理
  const handleDelete = async (topic) => {
    try {
      await deleteTopic({
        variables: {
          id: topic.node.id,
        },
      });
      await newClosedTopicsMutate();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    newClosedTopicsMutate();
  }, []);

  return (
    <>
      {/* 話し終えた話題の欄 */}
      <div className="pt-2 pb-4 px-2 m-2 shadow mb-4 border rounded bg-gray-100">
        <p className="text-center text-sm pt-2">話し終えた話題</p>
        <h2 className="text-3xl text-center pb-4 font-bold">😋Closed</h2>

        {/* ローディング中 */}
        {closedTopicLoading && (
          <div>
            <CircularProgress />
          </div>
        )}

        {/* エラー時 */}
        {closedTopicError && <div className="text-3xl">{closedTopicError}</div>}
        {newClosedTopicsError && (
          <div className="text-3xl">{newClosedTopicsError}</div>
        )}

        {/* 正常時 */}
        {newClosedTopicsData &&
          newClosedTopicsData.allTopics.edges.map((closedTopic, index) => {
            return (
              <div className="border bg-gray-50 p-2 my-2" key={index}>
                <h3 className="text-lg break-words">
                  {closedTopic.node.title}
                </h3>
                {isAdminLogin && isAdminEditMode ? (
                  <div className="pt-2 text-center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleDelete(closedTopic);
                      }}
                    >
                      削除
                      <DeleteForever />
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};
