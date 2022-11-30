import fastify from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import userRoutes from "./modules/user/user.route";
import fjwt from "fastify-jwt";
import { userSchemas } from "./modules/user/user.schema";
// import { request } from "http";
export const server = fastify({ logger: true });

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}
server.register(fjwt, {
  secret: process.env.JWT_SECRET,
});
server.decorate(
  "autheticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);
server.get("/healthcheck", async () => {
  return { status: "OK" };
});
async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }
  server.register(userRoutes, { prefix: "api/user" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    console.log("error starting server: ", err);
    process.exit(1);
  }
}
main();
