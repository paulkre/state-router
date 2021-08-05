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

const Context = React.createContext<RouteState | null>({
  id: "",
  active: false,
  visible: false,
  transition: null,
});

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
  const [prerunScheduled, setPrerunScheduled] = React.useState(
    id !== currentId
  );

  const state = React.useMemo<RouteState>(
    () => ({
      id,
      active: isTransitioning && prerunScheduled ? false : id === currentId,
      visible: id === currentId || (isTransitioning && id === prevId),
      transition:
        isTransitioning && (id === currentId || id === prevId)
          ? {
              entering: id === currentId,
            }
          : null,
    }),
    [isTransitioning, id, currentId, prevId, prerunScheduled]
  );

  React.useLayoutEffect(() => {
    setTimeout(() => setPrerunScheduled(id !== currentId));
  }, [id, currentId]);

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

  return <Context.Provider value={combinedState}>{children}</Context.Provider>;
};
