/**
 * Client-callable RPC surface for multiplayer rooms.
 *
 * Thin wrappers only: every rule check lives in rooms.server.ts and runs on the
 * server. There is deliberately no endpoint that accepts a game state from a
 * client — state can only change by submitting an action the engine accepts.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getRoomImpl,
  joinRoomImpl,
  leaveRoomImpl,
  startRoundImpl,
  submitActionImpl,
} from "./rooms.server";

const colorSchema = z.enum(["red", "yellow", "green", "blue"]);

const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("play"),
    playerId: z.string().max(64),
    cardId: z.string().max(64),
    chosenColor: colorSchema.optional(),
  }),
  z.object({ type: z.literal("draw"), playerId: z.string().max(64) }),
  z.object({ type: z.literal("pass"), playerId: z.string().max(64) }),
  z.object({ type: z.literal("say_uno"), playerId: z.string().max(64) }),
  z.object({
    type: z.literal("choose_color"),
    playerId: z.string().max(64),
    color: colorSchema,
  }),
]);

const identity = {
  code: z.string().min(4).max(8),
  playerId: z.string().min(1).max(64),
  token: z.string().min(1).max(128),
};

export const joinRoom = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        code: z.string().min(4).max(8),
        playerId: z.string().min(1).max(64),
        name: z.string().max(24),
        avatar: z.string().max(8),
        token: z.string().max(128).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => joinRoomImpl(data));

export const getRoom = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object(identity).parse(input))
  .handler(async ({ data }) => getRoomImpl(data));

export const startRound = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object(identity).parse(input))
  .handler(async ({ data }) => startRoundImpl(data));

export const submitAction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ ...identity, action: actionSchema }).parse(input),
  )
  .handler(async ({ data }) => submitActionImpl(data));

export const leaveRoom = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object(identity).parse(input))
  .handler(async ({ data }) => leaveRoomImpl(data));
