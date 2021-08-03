import React from "react";

import {
  useRouterState,
  useRouteData as useRouteDataBase,
  RouteData,
} from "./router";
import { useTransitioning } from "./transition-manager";

type RouteState = {
  id: string;
  active: boolean;
  visible: boolean;
  transition: { entering: boolean } | null;
};

const Context = React.createContext<RouteState>({
  id: "",
  active: false,
  visible: false,
  transition: null,
});

export function useRouteState(): RouteState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = Record<string, unknown>>() {
  const { id } = useRouteState();
  return useRouteDataBase<T>(id);
}

export const StateRoute: React.FC<{
  id: string;
}> = ({ children, id }) => {
  const { prevId, id: currentId } = useRouterState();
  const isTransitioning = useTransitioning();
  const [prerunScheduled, setPrerunScheduled] = React.useState(
    id !== currentId
  );

  const ctx = React.useMemo<RouteState>(
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

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};
