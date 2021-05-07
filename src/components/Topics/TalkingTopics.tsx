import { useQuery, useMutation } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { useContext } from "react";
import { GET_TALKING_TOPICS, UPDATE_TOPIC } from "src/apollo/queries";
import { UserContext } from "src/contexts/UserContext";
import useSWR from "swr";
import { request } from "graphql-request";

export const TalkingTopics: React.VFC<{ allMutate: Function }> = ({
  allMutate,
}) => {
  const { isAdminLogin, isAdminEditMode } = useContext(UserContext);

  // SWRで最新情報を取得
  const API_ENDPOINT =
    process.env.NODE_ENV === "production"
      ? `${process.env.API_ENDPOINT}`
      : `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`;

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

  const fetcher = (query) => request(API_ENDPOINT, query);

  const {
    data: newTalkingTopicsData,
    error: newTalkingTopicsError,
    // mutate: newTalkingTopicsMutate,
  } = useSWR(GET_NEW_TALKING_TOPICS, fetcher, { refreshInterval: 1000 });

  // 会話中の話題をすべて取得するQuery
  const {
    loading: talkingTopicsLoading,
    error: talkingTopicsError,
    // data: talkingTopicsData,
  } = useQuery(GET_TALKING_TOPICS);

  // 話題の状況を更新（終了）するMutation
  const [updateTopic] = useMutation(UPDATE_TOPIC);

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
      await allMutate();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {/* 現在の話題 */}
      <div className="pt-2 pb-4 px-2 m-2 shadow mb-4 border rounded bg-gray-100">
        <p className="text-center text-sm pt-2">話し中の話題</p>

        <h2 className="text-3xl text-center pb-4 font-bold">😳Talking</h2>

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
        {newTalkingTopicsError && (
          <div className="text-3xl">{newTalkingTopicsError}</div>
        )}

        {/* 正常時 */}
        {newTalkingTopicsData &&
          newTalkingTopicsData.allTopics.edges.map((talkingTopic, index) => {
            return (
              <div className="border bg-gray-50 p-2 my-2" key={index}>
                <h3 className="text-xl font-bold break-words">
                  {talkingTopic.node.title}
                </h3>
                {isAdminLogin && isAdminEditMode ? (
                  <div className="pt-2 text-center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleClosed(talkingTopic);
                      }}
                    >
                      終了
                      <Check />
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
