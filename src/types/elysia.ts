import type { InferContext } from "elysia";
import type { app } from "..";

export type ElysiaGlobalApp = typeof app;
export type ElysiaGlobalContext = InferContext<ElysiaGlobalApp>;
// biome-ignore lint/complexity/noBannedTypes: it's a workaround for Elysia's bug where the global type `params` is have type `never` but on local handler it's have type `{}`.
export type ElysiaGlobalContextForHandler = Omit<ElysiaGlobalContext, "params"> & { params: {} };
