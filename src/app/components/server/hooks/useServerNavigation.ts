// src/app/components/server/hooks/useServerNavigation.ts
import { useState } from "react";
import type { WaiterScreen } from "../types";

export function useServerNavigation(initialScreen: WaiterScreen = "dashboard") {
  const [screen, setScreen] = useState<WaiterScreen>(initialScreen);
  const [prevScreen, setPrevScreen] = useState<WaiterScreen>(initialScreen);

  const navigate = (to: WaiterScreen) => {
    setPrevScreen(screen);
    setScreen(to);
  };

  const goBack = () => {
    setScreen(prevScreen);
  };

  return { screen, prevScreen, navigate, goBack };
}