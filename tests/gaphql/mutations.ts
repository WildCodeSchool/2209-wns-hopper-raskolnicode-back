import { gql } from "apollo-server";

export const createUser = gql`mutation createUser($data: UserInput!){
  createUser(data: $data) {
    id
  }
}`

export const login = gql`mutation Login($data: UserInput!){
  login(data: $data)
}`