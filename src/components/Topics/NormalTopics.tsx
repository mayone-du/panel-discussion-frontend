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
import { UserContext } from "src/contexts/UserContext";
import useSWR from "swr";
import { request } from "graphql-request";

export const NormalTopics: React.VFC<{ allMutate: Function }> = ({
  allMutate,
}) => {
  const { isAdminLogin } = useContext(UserContext);

  // SWRで最新情報を取得
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

  const fetcher = (query) => request(API_ENDPOINT, query);
  const {
    data: newNormalTopicsData,
    error: newNormalTopicsError,
    // mutate: newNormalTopicMutate,
  } = useSWR(GET_NEW_NORMAL_TOPICS, fetcher);

  // 話題を項目ごとにすべて取得するQuery
  const {
    loading: normalTopicsLoading,
    error: normalTopicsError,
    // data: normalTopicsData,
  } = useQuery(GET_NORMAL_TOPICS);

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
      {/* 新規作成された話題の欄 */}
      <div className="pt-2 pb-4 px-1 md:w-2/3 border rounded shadow bg-gray-100 m-2">
        <p className="text-center text-sm pt-2">まだの話題</p>

        <h2 className="text-3xl text-center pb-4 font-bold">🤔Topics</h2>

        <div className="md:flex flex-wrap mt-1">
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
          {newNormalTopicsError && (
            <div className="text-3xl">{newNormalTopicsError}</div>
          )}

          {/* 正常時 */}
          {newNormalTopicsData &&
            newNormalTopicsData.allTopics.edges.map((topic, index) => {
              return (
                <div className="p-1 md:w-1/3" key={index}>
                  <div className="border rounded p-2 shadow-sm bg-gray-50 md:h-40 h-28 flex flex-col justify-between overflow-y-scroll break-words">
                    <div className="text-lg mb-2">{topic.node.title}</div>
                    {isAdminLogin ? (
                      <div className="flex justify-around">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            handleDelete(topic);
                          }}
                        >
                          削除
                          <DeleteForever />
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
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
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
