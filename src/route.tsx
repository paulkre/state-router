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
  layout: string;
}> = ({ children, layout: id }) => {
  const { prevRoute, route } = useRouterState();
  const isTransitioning = useTransitioning();
  const [prerunScheduled, setPrerunScheduled] = React.useState(id !== route);

  const ctx = React.useMemo<RouteState>(
    () => ({
      id,
      active: isTransitioning && prerunScheduled ? false : id === route,
      visible: id === route || (isTransitioning && id === prevRoute),
      transition:
        isTransitioning && (id === route || id === prevRoute)
          ? {
              entering: id === route,
            }
          : null,
    }),
    [isTransitioning, id, route, prevRoute, prerunScheduled]
  );

  React.useLayoutEffect(() => {
    setTimeout(() => setPrerunScheduled(id !== route));
  }, [id, route]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};