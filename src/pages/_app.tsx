import "src/styles/globalResets.css";
import "src/styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserContextProvider } from "src/contexts/UserContext";
import nookies from "nookies";
import { NextPageContext } from "next";

const App: React.FC<{
  Component: any;
  pageProps: any;
  ctx: NextPageContext;
}> = ({ Component, pageProps, ctx }) => {
  const cookies = nookies.get(ctx);

  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`,
    headers: {
      authorization: cookies.accessToken ? `JWT ${cookies.accessToken}` : "",
    },
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ApolloProvider>
  );
};

// export const getServerSideProps = async (context: NextPageContext) => {

//   nookies.set(context, 'cookieName', 'value', {path: '/'})
//   // Set
//   // nookies.set(context, 'cookieName', 'value', {})

//   // Destroy
//   // nookies.destroy(ctx, 'cookieName')

//   const cookies = nookies.get(context);

//   return { props: cookies }
// }
export default App;
