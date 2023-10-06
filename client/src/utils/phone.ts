import { KeyboardEventHandler } from "react";

export const blockInvalidChar: KeyboardEventHandler<HTMLDivElement> = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
