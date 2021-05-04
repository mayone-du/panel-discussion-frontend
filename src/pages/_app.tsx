import "src/styles/globalResets.css";
import "src/styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const App = ({ Component, pageProps }) => {
  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_DEV_API_URL}graphql/`,
    headers: {
      authorization: "",
    },
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
