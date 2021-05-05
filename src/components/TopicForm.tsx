import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import {Add} from '@material-ui/icons';
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
      <form onSubmit={handleTopicCreate} className="flex items-center justify-center w-full">
        <div className='mx-4 w-1/3'>
          <TextField
            type="text"
            value={topicTitle}
            onChange={handleTitleChange}
            variant="outlined"
            label='話すお題を入力してください。（例: 起業のきっかけ、etc...）'
            size="medium"
            className='w-full'
          />
        </div>
        <div>
          <Button size="large" type="submit" variant="outlined">
            <span className='mx-2'>作成する</span>
            <Add />
          </Button>
        </div>
      </form>
    </>
  );
};
