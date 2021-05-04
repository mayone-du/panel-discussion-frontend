import Link from "next/link";
import { Button } from "@material-ui/core";
import {UserContext} from 'src/contexts/UserContext';
import { useContext } from "react";

export const Layout: React.FC<{ children: any }> = ({ children }) => {
  const {adminUsername} = useContext(UserContext);
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
            <li>
              ユーザー情報: {adminUsername ? adminUsername : "ゲスト"}
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <article>
          <section className='px-20'>{children}</section>
        </article>
      </main>
    </>
  );
};
