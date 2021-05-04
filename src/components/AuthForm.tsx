import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { GET_AUTH_TOKEN } from "src/apollo/queries";

export const AuthForm: React.VFC = () => {

  const router = useRouter();
  const [getAuthToken] = useMutation(GET_AUTH_TOKEN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await getAuthToken({
        variables: {
          username: username,
          password: password,
        },
      });
      setUsername("");
      setPassword("");
      result.data &&
        localStorage.setItem("accessToken", result.data.tokenAuth.token);
      router.push("/");
    } catch (error) {
      alert(error);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            type="text"
            variant="outlined"
            value={username}
            onChange={handleNameChange}
            placeholder="ユーザーネーム"
          />
        </div>
        <div>
          <TextField
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            placeholder="パスワード"
          />
        </div>

        <div>
          <Button type="submit" variant="contained">
            ログイン
          </Button>
        </div>
      </form>
    </>
  );
};
