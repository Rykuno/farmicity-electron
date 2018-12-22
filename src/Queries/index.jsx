import gql from 'graphql-tag';

export const currentUser = gql`
  {
    user {
      id
      username
      email
    }
  }
`;

export const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export const signup = gql`
  mutation signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      id
      username
      email
    }
  }
`;

export const logout = gql`
  mutation {
    logout {
      id
      email
    }
  }
`;
