import Link from "next/link";
import { Button } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { UserContext } from "src/contexts/UserContext";
import { parseCookies, setCookie } from "nookies";
import { useContext, useEffect } from "react";
import { ALL_TOKEN_REFRESH } from "src/apollo/queries";

// すべてのページで呼ばれるコンポーネント
export const Layout: React.FC<{ children: any }> = ({ children }) => {
  const {
    isAdminLogin,
    setIsAdminLogin,
    isAdminEditMode,
    setIsAdminEditMode,
  } = useContext(UserContext);

  // refreshTokenによってトークンを2つとも更新するMutation
  const [allTokenRefresh] = useMutation(ALL_TOKEN_REFRESH);

  useEffect(() => {
    // Cookieをすべて取得
    const cookies = parseCookies();
    // refreshTokenがあった場合はTokenをどちらも更新
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
      setIsAdminLogin(false);
      console.log("Token is None.");
    }
  }, []);

  const handleModeChange = () => {
    if (!isAdminLogin) {
      alert("Admin Only");
      return;
    } else {
      setIsAdminEditMode(!isAdminEditMode);
    }
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <header className="p-2 bg-gray-50 shadow">
          <nav className="flex justify-between items-center md:mx-16 w-full">
            <h2 className="font-bold md:text-4xl text-xl md:w-1/3">
              {/* <img src="/images/logo.png" alt="" /> */}
              Qin
            </h2>
            <p className="md:w-1/3 md:text-base text-sm md:text-left text-center">
              <span className="md:text-xl font-bold md:inline block">
                <a className="mx-2" href="https://twitter.com/shimabu_it">
                  しまぶー
                </a>
                ✖
                <a
                  className="mx-2"
                  style={{ color: "#0E6163" }}
                  href="https://twitter.com/bb_ja_k"
                >
                  じゃけぇ
                </a>
              </span>
              によるパネルディスカッション🥳
            </p>
            <ul className="md:flex md:text-left text-center items-center justify-center md:w-1/3">
              <li className="my-4 mx-2">
                <Link href="/">
                  <Button variant="contained" color="default">
                    HOME
                  </Button>
                </Link>
              </li>
              <li className="my-4 mx-2">
                <Link href="/auth">
                  <Button variant="contained" color="default">
                    ログイン
                  </Button>
                </Link>
              </li>
              <li className="my-4 mx-2">
                <Button
                  variant="contained"
                  color="default"
                  onClick={handleModeChange}
                >
                  {isAdminEditMode ? "Edit" : "Read"}
                </Button>
              </li>
              <li className="my-4 mx-2">
                {isAdminLogin ? (
                  <div className="text-center">
                    <AccountCircle color="primary" />
                    <p className="text-xs text-blue-800">Admin</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <AccountCircle />
                    <p className="text-xs">Guest</p>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <section className="md:px-16 px-2">{children}</section>
          </article>
        </main>
        <footer className="py-6 px-4 mt-20 bg-black">
          <p className="text-white text-center">
            Developed by{" "}
            <a className="underline" href="https://twitter.com/mayo1201blog">
              まよねーづ
            </a>{" "}
            :{")"}
          </p>
        </footer>
      </div>
    </>
  );
};
