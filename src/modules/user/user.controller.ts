import { FastifyRequest, FastifyReply } from "fastify";
import { server } from "../../app";
import { verfiyPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

export async function registerUserHanlder(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (err) {
    console.log(err);
    return reply.code(500).send(err);
  }
}

export async function loginHanlder(
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const body = req.body;

  // find a user by email
  const user = await findUserByEmail(body.email);
  if (!user) {
    return reply.code(401).send({
      message: "Invalid credentials",
    });
  }
  // verify password
  const correctPassword = verfiyPassword({
    candidatePass: body.password,
    salt: user.salt,
    hash: user.password,
  });
  if (correctPassword) {
    const { password, salt, ...rest } = user;
    return { accessToken: server.jwt.sign(rest) };
  }
  return reply.code(401).send({
    message: "Invalid credentials!",
  });
}

export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}
