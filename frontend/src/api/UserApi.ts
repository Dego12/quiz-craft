import React from "react";
import { json } from "stream/consumers";
import { User } from "../models/User";
import settings from "../resources/settings.json";
import { LoginCredentialsDTO } from "../models/LoginCredentialsDTO";

export enum Method {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export const Base_url: string = settings.BaseUrl;

export const Endpoints = {
  login: "login",
};

const createHeaderByMethod = (method: Method, user?: LoginCredentialsDTO) => {
  let headerOptions: RequestInit = {
    method: `${method}`,
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: user !== null ? JSON.stringify(user) : "",
  };
  return headerOptions;
};

export const createApiEndpoint = (endpoint: string) => {
  let url: string = Base_url + "User/" + endpoint;

  return {
    post: async (user: LoginCredentialsDTO) => {
      return await fetch(url, createHeaderByMethod(Method.POST, user));
    },
    put: async (user: LoginCredentialsDTO) => {
      return await fetch(url, createHeaderByMethod(Method.PUT, user));
    },
    get: async () => {
      return await fetch(url, createHeaderByMethod(Method.GET));
    },
    delete: async (user: LoginCredentialsDTO) => {
      return await fetch(url, createHeaderByMethod(Method.DELETE, user));
    },
  };
};
