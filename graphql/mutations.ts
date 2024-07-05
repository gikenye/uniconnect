import { gql } from "../node_modules/graphql-request/build/esm/index";
import { makeRequest } from "./network";
import { ChangePasswordInput, ChangePasswordResponse, CreateBusinessInput, CreateBusinessResponse, DeleteBusinessResponse, EditBusinessResponse, ErrorResponse, LikeBusinessResponse, LoginInput, LoginResponse, PostCommentInput, PostCommentResponse, RegisterInput, RegisterResponse, VerifyUserResponse } from "../types/types";



export async function LOGIN(body: LoginInput) {
  const query = gql`
    mutation Login($input: LoginInput!) {
      Login(input: $input) {
        token
      }
    }`;
  const res: LoginResponse = await makeRequest(query, body, true);
  return res
}


export async function REGISTER(body: RegisterInput) {
  const query = gql`
    mutation refactored781($input: RegisterInput!) {
      Register(input: $input) {
        token
      }
    }`;
  const res: RegisterResponse = await makeRequest(query, body, true);
  return res
}



export async function CREATE_BUSINESS(body: RegisterInput) {
  const query = gql`
    mutation refactored270($input: CreateBusinessInput!) {
      CreateBusiness(input: $input)
    }`;
  const res: CreateBusinessResponse = await makeRequest(query, body, true);
  return res
}

export async function LIKE_BUSINESS(authToken: string, businessId: string) {
  const query = gql`
    mutation refactored500($token: String!, $bizId: String!) {
      LikeBusiness(token: $token, bizId: $bizId)
    }`;
  const res: LikeBusinessResponse = await makeRequest(query, { token: authToken, bizId: businessId }, false);
  return res
}


export async function POST_COMMENT(body: PostCommentInput) {
  const query = gql`
    mutation refactored93($input: PostCommentInput!) {
      PostComment(input: $input)
  }`;
  const res: PostCommentResponse = await makeRequest(query, body, true);
  return res
}

export async function EDIT_BUSINESS(body: CreateBusinessInput, businessId: String) {
  const query = gql`
  mutation refactored469($input: CreateBusinessInput!, $bizId: String!) {
    EditBusiness(input: $input, bizId: $bizId)
  }`;
  const res: EditBusinessResponse = await makeRequest(query, { input: body, bizId: businessId }, false);
  return res
}


export async function DELETE_BUSINESS(authToken: string, businessId: String) {
  const query = gql`
  mutation refactored660($token: String!, $bizId: String!) {
    DeleteBusiness(token: $token, bizId: $bizId)
  }`;
  const res: DeleteBusinessResponse = await makeRequest(query, { token: authToken, bizId: businessId }, false);
  return res
}


export async function CHANGE_PASSWORD(body: ChangePasswordInput) {
  const query = gql`
    mutation refactored130($input: ChangePasswordInput!) {
      ChangePassword(input: $input)
  }`;
  const res: ChangePasswordResponse = await makeRequest(query, body, true);
  return res
}


export async function VERIFY_USER(authToken: string, otpValue: string) {
  const query = gql`
  mutation refactored55($token: String!, $otp: String!) {
    VerifyUser(token: $token, otp: $otp)
  }`;
  const res: VerifyUserResponse = await makeRequest(query, { token: authToken, otp: otpValue }, false);
  return res
}