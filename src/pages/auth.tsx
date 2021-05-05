import { Layout } from "src/components/Layout/Layout";
import { AuthForm } from "src/components/AuthForm";

const Auth: React.FC = () => {
  return (
    <>
      <Layout>
        <h1 className="text-3xl text-center font-bold py-8 mt-10 mb-8">
          管理者ログイン画面
        </h1>
        <div className='mb-80'>
        <AuthForm />
        </div>

        {/* <div className='py-20'>

          <p className='text-center text-sm'>
            Follow me...😳👇
          </p>
          <p className='text-center'>
            <a className='text-xs underline' href="https://twitter.com/mayo1201blog">
              まよねーづ
            </a>
          </p>
        </div> */}
      </Layout>
    </>
  );
};

export default Auth;
