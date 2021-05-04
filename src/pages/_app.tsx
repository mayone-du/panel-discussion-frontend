import "src/styles/globalResets.css";
import "src/styles/globals.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserContextProvider } from "src/contexts/UserContext";

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
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ApolloProvider>
  );
};

export default App;
