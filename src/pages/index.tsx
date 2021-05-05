import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import { DeleteForever, Check, Chat } from "@material-ui/icons";
import { useContext } from "react";
import {
  GET_ALL_TOPICS,
  GET_TALKING_TOPIC,
  GET_CLOSED_TOPICS,
  UPDATE_TOPIC,
} from "src/apollo/queries";
import { Layout } from "src/components/Layout/Layout";
import { TopicForm } from "src/components/TopicForm";
import { UserContext } from "src/contexts/UserContext";

const Index: React.FC = () => {
  const { isAdminLogin } = useContext(UserContext);

  const {
    loading: allTopicsLoading,
    error: allTopicsError,
    data: allTopicsData,
  } = useQuery(GET_ALL_TOPICS);

  const { data: talkingTopicData } = useQuery(GET_TALKING_TOPIC);
  const { data: closedTopicsData } = useQuery(GET_CLOSED_TOPICS);

  const [updateTopic] = useMutation(UPDATE_TOPIC, {
    refetchQueries: [
      { query: GET_ALL_TOPICS },
      { query: GET_TALKING_TOPIC },
      { query: GET_CLOSED_TOPICS },
    ],
  });

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

  const handleDelete = () => {
    alert("delete");
    return;
  };

  return (
    <>
      <Layout>
        <div className="flex justify-center py-4">
          <TopicForm />
        </div>

        <div className="flex">
          <div className="w-2/3 bg-blue-200 flex flex-wrap">
            {allTopicsLoading && <div className="text-9xl">Loading</div>}
            {allTopicsError && (
              <div className="text-3xl">{allTopicsError.message}</div>
            )}
            {allTopicsData &&
              allTopicsData.allTopics.edges.map((topic, index) => {
                return (
                  <div className="p-1 w-1/3" key={index}>
                    <div className="border p-2">
                      <div className="text-xl">{topic.node.title}</div>
                      <div
                        className={
                          topic.node.isTalking
                            ? "text-red-600"
                            : "text-blue-600"
                        }
                      >
                        isTalking: {String(topic.node.isTalking)}
                      </div>
                      <div
                        className={
                          topic.node.isClosed ? "text-red-600" : "text-blue-600"
                        }
                      >
                        isClosed: {String(topic.node.isClosed)}
                      </div>
                      {isAdminLogin ? (
                        <>
                          <Button variant="contained" onClick={handleDelete}>
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
                        </>
                      ) : (
                        <div>AdminUser only</div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="w-1/3">
            <div className="bg-red-200">
              <h2 className="text-xl text-center py-2">Talking</h2>
              {talkingTopicData &&
                talkingTopicData.allTopics.edges.map((talkingTopic, index) => {
                  return (
                    <div key={index}>
                      <h3 className="text-lg">{talkingTopic.node.title}</h3>
                    </div>
                  );
                })}
            </div>
            <div className="bg-green-200">
              <h2 className="text-xl text-center py-2">Closed</h2>{" "}
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
