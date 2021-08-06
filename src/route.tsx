import React from "react";

import {
  useRouterState,
  useRouteData as useRouteDataBase,
  RouteData,
} from "./router";
import { useTransitioning } from "./transition-manager";

type TransitionState = {
  entering: boolean;
};

export type RouteState = {
  id: string;
  active: boolean;
  visible: boolean;
  transition: TransitionState | null;
};

const Context = React.createContext<RouteState | null>(null);

export const RouteContextProvider = Context.Provider;
export function useRouteState(): RouteState | null {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = Record<string, unknown>>() {
  const state = useRouteState();
  return useRouteDataBase<T>(state?.id || null);
}

const mergeTransitionStates = (
  a: TransitionState | null,
  b: TransitionState | null
): TransitionState | null =>
  a && b ? { entering: a.entering || b.entering } : a || b;

export const StateRoute: React.FC<{
  id: string;
}> = ({ children, id }) => {
  const parentState = useRouteState();
  const { prevId, id: currentId } = useRouterState();
  const isTransitioning = useTransitioning();

  const state = React.useMemo<RouteState>(() => {
    const active = id === currentId;
    return {
      id,
      active,
      visible: active || (isTransitioning && id === prevId),
      transition:
        isTransitioning && (active || id === prevId)
          ? {
              entering: active,
            }
          : null,
    };
  }, [id, currentId, prevId, isTransitioning]);

  const combinedState = React.useMemo<RouteState>(
    () =>
      parentState
        ? {
            id: parentState.id,
            active: state.active || parentState.active,
            visible: state.visible || parentState.visible,
            transition: mergeTransitionStates(
              state.transition,
              parentState.transition
            ),
          }
        : state,
    [state, parentState]
  );

  return (
    <RouteContextProvider value={combinedState}>
      {children}
    </RouteContextProvider>
  );
};
