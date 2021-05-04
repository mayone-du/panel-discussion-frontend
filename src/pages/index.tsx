import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { GET_ALL_TOPICS } from "src/apollo/queryies";

const Index: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_TOPICS);


  return (
    <>
      <div>
        {/* {loading
          ? "loading"
          : data.allTopics.edges.map((topic, index) => {
              return <div key={index}>{topic}</div>;
            })} */}
        {loading
          ? <div className="text-6xl">Loading</div>
          : data.allTopics.edges.map((topic, index) => {
              return (
                <div className="border m-8" key={index}>
                  <div className="text-lg">{topic.node.id}</div>
                  <div className="text-xl">{topic.node.title}</div>
                  <div className={topic.node.isTalking ? "text-red-600" : "text-blue-600"}>isTalking: {String(topic.node.isTalking)}</div>
                  <div className={topic.node.isClosed ? "text-red-600" : "text-blue-600"}>isClosed: {String(topic.node.isClosed)}</div>
                </div>
              );
            })}
      </div>
    </>
  );
};

export default Index;
