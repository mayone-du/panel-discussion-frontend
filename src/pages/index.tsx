import { useQuery, useMutation } from "@apollo/client";
import { Button, CircularProgress } from "@material-ui/core";
import { DeleteForever, Check, Chat } from "@material-ui/icons";
import { useContext } from "react";
import {
  GET_NORMAL_TOPICS,
  GET_TALKING_TOPIC,
  GET_CLOSED_TOPICS,
  UPDATE_TOPIC,
  DELETE_TOPIC,
} from "src/apollo/queries";
import { Layout } from "src/components/Layout/Layout";
import { TopicForm } from "src/components/TopicForm";
import { UserContext } from "src/contexts/UserContext";

const Index: React.FC = () => {
  const { isAdminLogin } = useContext(UserContext);

  // 話題を項目ごとにすべて取得するQuery
  const {
    loading: normalTopicsLoading,
    error: normalTopicsError,
    data: normalTopicsData,
  } = useQuery(GET_NORMAL_TOPICS);
  const {
    loading: talkingTopicLoading,
    error: talkingTopicError,
    data: talkingTopicData,
  } = useQuery(GET_TALKING_TOPIC);
  const {
    loading: closedTopicLoading,
    error: closedTopicError,
    data: closedTopicsData,
  } = useQuery(GET_CLOSED_TOPICS);

  // 話題の状況を更新するMutation
  const [updateTopic] = useMutation(UPDATE_TOPIC, {
    refetchQueries: [
      { query: GET_NORMAL_TOPICS },
      { query: GET_TALKING_TOPIC },
      { query: GET_CLOSED_TOPICS },
    ],
  });

  // 話題を削除するMutation
  const [deleteTopic] = useMutation(DELETE_TOPIC, {
    refetchQueries: [{ query: GET_NORMAL_TOPICS }],
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
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Layout>
        <div className="flex justify-center py-4">
          <TopicForm />
        </div>

        <div className="flex">
          {/* 新規作成された話題の欄 */}
          <div className="w-2/3 bg-blue-200 flex flex-wrap min-h-full">
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
            {normalTopicsData &&
              normalTopicsData.allTopics.edges.map((topic, index) => {
                return (
                  <div className="p-1 w-1/3" key={index}>
                    <div className="border p-2 h-52">
                      <div className="text-lg">{topic.node.title}</div>
                      {isAdminLogin ? (
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleDelete(topic);
                            }}
                          >
                            <DeleteForever />
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleClosed(topic);
                            }}
                          >
                            <Check />
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleTalking(topic);
                            }}
                          >
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
          <div className="w-1/3">
            {/* 現在の話題 */}
            <div className="bg-red-200">
              <h2 className="text-xl text-center py-2">Talking</h2>

              {/* ローディング中 */}
              {talkingTopicLoading && (
                <div>
                  <CircularProgress />
                </div>
              )}

              {/* エラー時 */}
              {talkingTopicError && (
                <div className="text-3xl">{talkingTopicError}</div>
              )}

              {/* 正常時 */}
              {talkingTopicData &&
                talkingTopicData.allTopics.edges.map((talkingTopic, index) => {
                  return (
                    <div key={index}>
                      <h3 className="text-lg">{talkingTopic.node.title}</h3>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => {
                            handleClosed(talkingTopic);
                          }}
                        >
                          <Check />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 話し終えた話題の欄 */}
            <div className="bg-green-200">
              <h2 className="text-xl text-center py-2">Closed</h2>

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
              {closedTopicsData &&
                closedTopicsData.allTopics.edges.map((closedTopic, index) => {
                  return (
                    <div key={index}>
                      <h3 className="text-lg">{closedTopic.node.title}</h3>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
