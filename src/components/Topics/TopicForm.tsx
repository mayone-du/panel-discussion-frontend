import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { Create } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { GET_NORMAL_TOPICS, CREATE_TOPIC } from "src/apollo/queries";

export const TopicForm: React.VFC<{ newNormalTopicsMutate: Function }> = ({
  newNormalTopicsMutate,
}) => {
  // 話題のタイトル入力欄のvalueをstateとして保持
  const [topicTitle, setTopicTitle] = useState("");
  const [inputStatus, setInputStatus] = useState<"normal" | "danger" | "error">(
    "normal"
  );

  useEffect(() => {
    if (topicTitle.length >= 201) {
      setInputStatus("error");
    } else {
      setInputStatus("normal");
    }
  }, [topicTitle]);

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
    if (inputStatus === "error") {
      alert("200文字までで入力してください。");
      return;
    }
    // 話題が入力されていたら作成
    if (topicTitle) {
      try {
        await createTopic({
          variables: {
            title: topicTitle,
          },
        });
        await setTopicTitle("");
        await newNormalTopicsMutate();
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
      <form
        onSubmit={handleTopicCreate}
        className="md:flex items-center justify-center w-full"
      >
        <div className="md:mx-4 mx-2 my-2 md:w-1/3">
          <TextField
            type="text"
            value={topicTitle}
            onChange={handleTitleChange}
            variant="outlined"
            label="話題を入力（例: 起業のきっかけ、etc...）"
            size="medium"
            className="w-full"
            error={inputStatus === "error"}
            helperText={
              inputStatus === "error"
                ? `${topicTitle.length} / 200 話題は200文字までで入力してください。`
                : `${topicTitle.length} / 200`
            }
          />
        </div>
        <div className="md:block flex justify-center pt-2 md:pt-0">
          <Button size="large" color="primary" type="submit" variant="outlined">
            <span className="mx-2 font-bold">投稿する</span>
            <Create color="primary" />
          </Button>
        </div>
      </form>
    </>
  );
};
