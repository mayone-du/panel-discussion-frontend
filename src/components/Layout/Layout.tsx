import Link from "next/link";
import { Button } from "@material-ui/core";

export const Layout: React.FC<{ children: any }> = ({ children }) => {
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
