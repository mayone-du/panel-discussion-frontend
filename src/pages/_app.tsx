import "src/styles/globalResets.css";
import "src/styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserContextProvider } from "src/contexts/UserContext";
import nookies from "nookies";
import { NextPageContext } from "next";

const App: React.FC<{
  Component: any;
  pageProps: any;
  context: NextPageContext;
}> = ({ Component, pageProps, context }) => {
  const cookies = nookies.get(context);

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

export default App;
