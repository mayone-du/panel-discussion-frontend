import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { GET_NORMAL_TOPICS, CREATE_TOPIC } from "src/apollo/queries";

export const TopicForm: React.VFC = () => {
  // 話題のタイトル入力欄のvalueをstateとして保持
  const [topicTitle, setTopicTitle] = useState("");
  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTopicTitle(e.target.value);
  };

  // 話題を作成するMutation
  const [createTopic] = useMutation(CREATE_TOPIC, {
    refetchQueries: [{ query: GET_NORMAL_TOPICS }],
  });

  // 話題の作成ボタンが押されたときの処理
  const handleTopicCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    await e.preventDefault();

    // 話題が入力されていたら作成
    if (topicTitle) {
      try {
        await createTopic({
          variables: {
            title: topicTitle,
          },
        });
        setTopicTitle("");
      } catch (error) {
        alert(error);
      }
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
