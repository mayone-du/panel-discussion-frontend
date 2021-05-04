import { useQuery } from "@apollo/client";
import { Button } from "@material-ui/core";
import { useContext } from "react";
import { GET_ALL_TOPICS } from "src/apollo/queries";
import { Layout } from "src/components/Layout/Layout";
import { TopicForm } from "src/components/TopicForm";
import { UserContext } from "src/contexts/UserContext";

const Index: React.FC = () => {
  const { adminUsername } = useContext(UserContext);

  const {
    loading: allTopicsLoading,
    error: allTopicsError,
    data: allTopicsData,
  } = useQuery(GET_ALL_TOPICS);

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
                      {adminUsername ? (
                        <>
                          <Button variant="contained">削除</Button>
                          <Button variant="contained">終了</Button>
                        </>
                      ) : (
                        <div>hoge</div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="w-1/3">
            <div className="bg-red-200">
              <h2 className="text-xl text-center py-2">Talking</h2>
              <h3 className="text-lg">hogeeeeeeeeeee</h3>
            </div>
            <div className="bg-green-200">
              <h2 className="text-xl text-center py-2">Closed</h2>
              <h3 className="text-lg">fooooooo</h3>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
