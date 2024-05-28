import type { JWTPayloadSpec } from "@elysiajs/jwt";
import type { Context } from "elysia";

export interface ElysiaContext extends Context {
  jwt: {
    readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string | undefined) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
  };
  bearer: string | undefined;
}
