import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { GET_NORMAL_TOPICS, CREATE_TOPIC } from "src/apollo/queries";

export const TopicForm: React.VFC = () => {
  const [topicTitle, setTopicTitle] = useState("");
  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTopicTitle(e.target.value);
  };

  const [createTopic] = useMutation(CREATE_TOPIC, {
    refetchQueries: [{ query: GET_NORMAL_TOPICS }],
  });

  const handleTopicCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (topicTitle) {
      createTopic({
        variables: {
          title: topicTitle,
        },
      });
      setTopicTitle("");
    } else {
      alert("話題を入力してください。");
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleTopicCreate} className="flex items-center">
        <div>
          <TextField
            type="text"
            value={topicTitle}
            onChange={handleTitleChange}
            variant="outlined"
            placeholder="話題を入力"
          />
        </div>
        <div>
          <Button type="submit" variant="outlined">
            作成
          </Button>
        </div>
      </form>
    </>
  );
};
