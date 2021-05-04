import { Layout } from "src/components/Layout/Layout";
import {AuthForm} from 'src/components/AuthForm';

const Auth: React.FC = () => {

  return (
    <>
      <Layout>
        <h1>auth</h1>
        <AuthForm />
      </Layout>
    </>
  );
};

export default Auth;
