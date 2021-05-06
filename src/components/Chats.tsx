import useSWR from "swr";
import { request } from "graphql-request";
import { TextField, Button } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_COMMENTS, CREATE_COMMENT } from "src/apollo/queries";

export const Chats: React.VFC<{ allMutate: Function }> = ({ allMutate }) => {
  const [commentText, setCommentText] = useState("");
  const [nickname, setNickname] = useState("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

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
    // mutate: newAllCommentsMutate,
  } = useSWR(GET_NEW_ALL_COMMENTS, fetcher, { refreshInterval: 1000 });

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_ALL_COMMENTS }],
  });

  const handleCommentCreate = async () => {
    if (commentText === "") {
      alert("文字を入力してください。");
      return;
    } else {
      try {
        await createComment({
          variables: {
            text: commentText,
            nickname: nickname,
          },
        });
        allMutate();
        setCommentText("");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <>
      <div className="md:w-1/2">
        <div className="w-full h-full max-h-screen bg-gray-100 pt-2 m-2 border rounded shadow">
          <p className="text-center text-sm pt-2">チャット</p>

          <h2 className="text-3xl text-center pb-4 font-bold">Chat</h2>

          {/* チャット欄 */}
          <div className="bg-gray-50 p-2 m-2 rounded border shadow-sm break-words overflow-y-scroll overflow-x-hidden h-2/3">
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
                    <span className="absolute -top-2 left-0 text-xs text-gray-600">
                      {comment.node.nickname || "匿名"}
                    </span>
                    {comment.node.text}
                    <span className="text-xs text-gray-600 absolute bottom-0 right-0">
                      {comment.node.createdAt}
                    </span>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-center mt-6">
            <div className="bg-white">
              <TextField
                value={nickname}
                onChange={handleNicknameChange}
                label="ニックネーム"
                variant="outlined"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-2">
            <div className="w-4/5 bg-white">
              <TextField
                variant="outlined"
                className="w-full"
                label="コメントを送信"
                color="primary"
                value={commentText}
                onChange={handleCommentChange}
              />
            </div>
            <div className="ml-2 bg-white">
              <Button variant="outlined" onClick={handleCommentCreate}>
                <div>
                  <div className="text-center">
                    <Send />
                  </div>

                  <span className="block text-center text-xs">送信</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
