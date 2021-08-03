import React from "react";

import { useRouterState } from "./router";

const Context = React.createContext(false);

export function useTransitioning() {
  return React.useContext(Context);
}

export const TransitionManager: React.FC<{ duration: number }> = ({
  children,
  duration,
}) => {
  const { id: routeID } = useRouterState();
  const [handledRoute, setHandledRoute] = React.useState(routeID);

  React.useEffect(() => {
    if (routeID === handledRoute) return;
    const timeout = setTimeout(() => setHandledRoute(routeID), duration);
    return () => clearTimeout(timeout);
  }, [routeID, handledRoute, duration]);

  return (
    <Context.Provider value={routeID !== handledRoute}>
      {children}
    </Context.Provider>
  );
};
