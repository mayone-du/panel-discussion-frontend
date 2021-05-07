import useSWR from "swr";
import { request } from "graphql-request";
import { TextField, Button } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_COMMENTS, CREATE_COMMENT } from "src/apollo/queries";

export const Chats: React.VFC = () => {

  // 入力欄のローカルstate
  const [commentText, setCommentText] = useState("");
  const [nickname, setNickname] = useState("");

  // コメントのテキストの入力欄の変更
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };
  // ニックネームの入力欄の変更
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };


  // SWRで最新情報を取得
  const API_ENDPOINT =
    process.env.NODE_ENV === "production"
      ? `${process.env.API_ENDPOINT}`
      : `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`;

  const GET_NEW_ALL_COMMENTS = `query {
    allComments {
      edges {
        node {
          id
          text
          nickname
          createdAt
        }
      }
    }
  }`;
  const fetcher = (query) => request(API_ENDPOINT, query);

  const {
    data: newAllCommentsData,
    error: newAllCommentsError,
    mutate: newAllCommentsMutate,
  } = useSWR(GET_NEW_ALL_COMMENTS, fetcher, { refreshInterval: 1000 });

  // コメント作成のMutationをimport
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_ALL_COMMENTS }],
  });

  // コメントが作成されたときの処理
  // 文字数で2通りのエラーチェックあり
  const handleCommentCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    await e.preventDefault();
    if (commentText === "") {
      await alert("文字を入力してください。");
      return;
    } else if (nickname.length > 15) {
      await alert("ニックネームは15字までで入力してください。");
      return;
    } else {
      try {
        await createComment({
          variables: {
            text: commentText,
            nickname: nickname,
          },
        });
        await newAllCommentsMutate();
        await setCommentText("");
      } catch (error) {
        alert(error);
      }
    }
  };

  // 日付の形式を変換
  const fixDateFormat = useCallback((createdAt: string): string => {

    // タイムスタンプ形式に変換
    const parsedTimestamp = Date.parse(createdAt);
    // JSTへ変換
    const newDate = new Date(parsedTimestamp);
    // 各項目ごとに値を取得、置き換え
    const newMonth =
      newDate.getMonth() + 1 < 10
        ? "0" + (newDate.getMonth() + 1)
        : newDate.getMonth() + 1;
    const newDay =
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    const newHours =
      newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours();
    const newMinutes =
      newDate.getMinutes() < 10
        ? "0" + newDate.getMinutes()
        : newDate.getMinutes();

    const fixedDate = `${newDate.getFullYear()}/${newMonth}/${newDay} ${newHours}:${newMinutes}`;

    return fixedDate;
  }, []);

  return (
    <>
      <div className="bg-gray-100 pt-2 m-2 border rounded shadow">
        <p className="text-center text-sm pt-2">チャット</p>

        <h2 className="text-3xl text-center pb-4 font-bold">😎Chat</h2>

        {/* チャット欄 */}
        <div className="bg-gray-50 p-2 m-2 rounded border shadow-sm break-words overflow-y-scroll overflow-x-hidden h-96">
          {/* コメント */}

          {/* エラー時 */}
          {newAllCommentsError && <div>{newAllCommentsError}</div>}

          {/* 正常時 */}
          {newAllCommentsData &&
            newAllCommentsData.allComments.edges.map((comment, index) => {
              return (
                <div
                  key={index}
                  className="rounded-lg px-2 pt-2 pb-4 my-3 border bg-gray-50 shadow-sm relative"
                >
                  <span className="absolute -top-2 left-0 text-xs text-gray-500">
                    {comment.node.nickname || "匿名"}
                  </span>
                  {comment.node.text}
                  <span className="text-xs text-gray-500 absolute bottom-0 right-2">
                    {fixDateFormat(comment.node.createdAt)}
                  </span>
                </div>
              );
            })}
        </div>

        <form onSubmit={handleCommentCreate}>
          <div className="flex justify-center mt-6">
            <div className="bg-white w-2/3">
              <TextField
                value={nickname}
                onChange={handleNicknameChange}
                label="ニックネーム"
                placeholder="未入力で匿名"
                variant="outlined"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-2 pb-4">
            <div className="w-4/5 bg-white">
              <TextField
                variant="outlined"
                className="w-full"
                label="コメントを入力"
                color="primary"
                value={commentText}
                onChange={handleCommentChange}
              />
            </div>
            <div className="ml-2 bg-white">
              <Button variant="contained" color="primary" type="submit">
                <div>
                  <div className="text-center">
                    <Send />
                  </div>

                  <span className="block text-center text-xs">送信</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
