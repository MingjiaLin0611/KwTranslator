import type { InjectionRecord } from "./types";

export const SET_ENABLED_MESSAGE = "KW_TRANSLATOR_SET_ENABLED";

export interface SetEnabledMessage {
  type: typeof SET_ENABLED_MESSAGE;
  enabled: boolean;
}

export interface SetEnabledResponse {
  ok: boolean;
  records?: InjectionRecord[];
  error?: string;
}

export function isSetEnabledMessage(message: unknown): message is SetEnabledMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    (message as SetEnabledMessage).type === SET_ENABLED_MESSAGE &&
    typeof (message as SetEnabledMessage).enabled === "boolean"
  );
}
