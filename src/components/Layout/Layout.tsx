import Link from "next/link";
import { Button } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { UserContext } from "src/contexts/UserContext";
import { parseCookies, setCookie } from "nookies";
import { useContext, useEffect } from "react";
import { ALL_TOKEN_REFRESH } from "src/apollo/queries";

export const Layout: React.FC<{ children: any }> = ({ children }) => {
  const { isAdminLogin, setIsAdminLogin } = useContext(UserContext);

  const [allTokenRefresh] = useMutation(ALL_TOKEN_REFRESH);

  useEffect(() => {
    const cookies = parseCookies();

    if (cookies.refreshToken) {
      (async () => {
        const result = await allTokenRefresh({
          variables: {
            refreshToken: cookies.refreshToken,
          },
        });
        setCookie(null, "accessToken", result.data.refreshToken.token, {
          path: "/",
          maxAge: 60 * 60,
        });
        setCookie(null, "refreshToken", result.data.refreshToken.refreshToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        setIsAdminLogin(true);
      })();
    } else {
      console.log("Token is None");
    }
  }, []);

  return (
    <>
      <header className="p-2 bg-gray-50">
        <nav>
          <ul className="flex items-center justify-center">
            <li className="m-4">
              <Link href="/">
                <Button variant="contained" color="primary">
                  HOME
                </Button>
              </Link>
            </li>
            <li className="m-4">
              <Link href="/auth">
                <Button variant="contained" color="primary">
                  管理者ログイン
                </Button>
              </Link>
            </li>
            <li>ユーザー情報: {isAdminLogin ? "AdminUser" : "ゲスト"}</li>
          </ul>
        </nav>
      </header>
      <main>
        <article>
          <section className="px-20">{children}</section>
        </article>
      </main>
    </>
  );
};
