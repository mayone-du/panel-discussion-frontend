import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import React, { useState, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { GET_TOKENS } from "src/apollo/queries";
import { UserContext } from "src/contexts/UserContext";
import { destroyCookie, setCookie } from "nookies";

export const AuthForm: React.VFC = () => {
  const { isAdminLogin, setIsAdminLogin } = useContext(UserContext);

  const router = useRouter();
  const [getTokens] = useMutation(GET_TOKENS);
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
      const result = await getTokens({
        variables: {
          username: username,
          password: password,
        },
      });
      result.data &&
        setCookie(null, "accessToken", result.data.tokenAuth.token, {
          path: "/",
          maxAge: 60 * 60,
        });
      setCookie(null, "refreshToken", result.data.tokenAuth.refreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      setIsAdminLogin(true);
      setUsername("");
      setPassword("");

      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleLogout = async () => {
    destroyCookie(null, "accessToken");
    destroyCookie(null, "refreshToken");
    setIsAdminLogin(false);
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

      {isAdminLogin && (
        <div>
          <Button
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
