import { Layout } from "src/components/Layout/Layout";
import {AuthForm} from 'src/components/AuthForm';

const Auth: React.FC = () => {

  return (
    <>
      <Layout>
        <h1 className='text-3xl text-center font-bold py-8'>管理者ログイン画面</h1>
        <AuthForm />
      </Layout>
    </>
  );
};

export default Auth;
