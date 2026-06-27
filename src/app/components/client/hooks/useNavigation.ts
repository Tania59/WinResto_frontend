// src/app/components/client/hooks/useNavigation.ts
import { useState } from "react";
import type { Screen } from "../types";
import { screenOrder } from "../constants";

export function useNavigation(initialScreen: Screen = "welcome") {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [prevScreen, setPrevScreen] = useState<Screen>(initialScreen);

  const navigate = (to: Screen) => {
    setPrevScreen(screen);
    setScreen(to);
  };

  const direction = screenOrder.indexOf(screen) > screenOrder.indexOf(prevScreen) ? 1 : -1;

  return { screen, prevScreen, navigate, direction };
}