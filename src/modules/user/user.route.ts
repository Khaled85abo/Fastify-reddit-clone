import { FastifyInstance } from "fastify";
import {
  registerUserHanlder,
  loginHanlder,
  getUsersHandler,
} from "./user.controller";
import { $ref } from "./user.schema";
async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: { 201: $ref("createUserResponseSchema") },
      },
    },
    registerUserHanlder
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: { 200: $ref("loginResponseSchema") },
      },
    },
    loginHanlder
  );

  // server.get(
  //   "/",
  //   {
  //     preHandler: [server.authenticate],
  //   },
  //   getUsersHandler
  // );
}

export default userRoutes;
