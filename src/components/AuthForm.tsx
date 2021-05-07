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

  // アクセストークン、リフレッシュトークンをを取得するMutation
  const [getTokens] = useMutation(GET_TOKENS);

  // ログイン入力欄のローカルstate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ユーザーネームの入力欄が変更されたときの処理
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    []
  );
  // パスワードの入力欄が変更されたときの処理
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  // ログインボタンが押されたときの処理
  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    await e.preventDefault();

    // Tokenを2つとも取得してCookieにセットする
    try {
      const result = await getTokens({
        variables: {
          username: username,
          password: password,
        },
      });
      result.data &&
        (await setCookie(null, "accessToken", result.data.tokenAuth.token, {
          path: "/",
          maxAge: 60 * 60,
        }));
      await setCookie(
        null,
        "refreshToken",
        result.data.tokenAuth.refreshToken,
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }
      );
      await setIsAdminLogin(true);
      await setUsername("");
      await setPassword("");

      // トップページに遷移
      await router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  // ログアウトボタンが押されたときにCookieのTokenを2つとも削除
  const handleLogout = async () => {
    await destroyCookie(null, "accessToken");
    await destroyCookie(null, "refreshToken");
    await setIsAdminLogin(false);
    await router.push("/");
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex justify-center pb-8">
          <TextField
            type="text"
            variant="outlined"
            value={username}
            onChange={handleNameChange}
            label="ユーザーネーム"
            className="md:w-1/3"
          />
        </div>
        <div className="flex justify-center pb-8">
          <TextField
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            label="パスワード"
            helperText="事前にまよねーづから渡されたパスワードを入力してください。"
            className="md:w-1/3"
          />
        </div>

        <div className="flex justify-center my-8">
          <div className="flex justify-center pb-8 mx-4">
            <Button type="submit" color="primary" variant="contained">
              ログイン
            </Button>
          </div>
          {isAdminLogin && (
            <div className="flex justify-center pb-8 mx-4">
              <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
              >
                ログアウト
              </Button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
