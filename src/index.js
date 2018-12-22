import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AppRouter from './routes';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
});

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache,
  request: async operation => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include'
      }
    });
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3498db'
    },
    secondary: {
      main: '#27ae60'
    },
    text: {
      primary: "rgb(114,118,125)"
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <AppRouter />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
