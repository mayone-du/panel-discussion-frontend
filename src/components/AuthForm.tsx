import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import React, { useState, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { GET_AUTH_TOKEN } from "src/apollo/queries";
import { UserContext } from "src/contexts/UserContext";

export const AuthForm: React.VFC = () => {
  const { adminUsername, setAdminUsername } = useContext(UserContext);

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

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await getAuthToken({
        variables: {
          username: username,
          password: password,
        },
      });
      result.data &&
        localStorage.setItem("accessToken", result.data.tokenAuth.token);
      setAdminUsername(username);
      setUsername("");
      setPassword("");

      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    setAdminUsername("");
  };

  return (
    <>
      <form onSubmit={handleLogin}>
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

      {adminUsername && (
        <div>
          <Button
            href="/"
            onClick={handleLogout}
            variant="contained"
            color="secondary"
          >
            LOGOUT
          </Button>
        </div>
      )}
    </>
  );
};
