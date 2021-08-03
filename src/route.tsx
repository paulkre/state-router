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
  const { prevRouteID, routeID } = useRouterState();
  const isTransitioning = useTransitioning();
  const [prerunScheduled, setPrerunScheduled] = React.useState(id !== routeID);

  const ctx = React.useMemo<RouteState>(
    () => ({
      id,
      active: isTransitioning && prerunScheduled ? false : id === routeID,
      visible: id === routeID || (isTransitioning && id === prevRouteID),
      transition:
        isTransitioning && (id === routeID || id === prevRouteID)
          ? {
              entering: id === routeID,
            }
          : null,
    }),
    [isTransitioning, id, routeID, prevRouteID, prerunScheduled]
  );

  React.useLayoutEffect(() => {
    setTimeout(() => setPrerunScheduled(id !== routeID));
  }, [id, routeID]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};
