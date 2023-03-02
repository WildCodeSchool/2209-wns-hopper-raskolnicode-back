import { gql } from "apollo-server";

export const loggedUser = gql`query LoggedUser {
  loggedUser {
    id
    email
  }
}`