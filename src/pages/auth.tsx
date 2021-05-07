import { Layout } from "src/components/Layout/Layout";
import { AuthForm } from "src/components/AuthForm";

const Auth: React.VFC = () => {
  return (
    <>
      <Layout>
        <h1 className="text-3xl text-center font-bold py-8 mt-10 mb-8">
          管理者ログイン画面
        </h1>
        <div className="md:mb-80 mb-20">
          <AuthForm />
        </div>
      </Layout>
    </>
  );
};

export default Auth;
