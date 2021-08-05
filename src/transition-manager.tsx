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
  const { id } = useRouterState();
  const [handledRoute, setHandledRoute] = React.useState(id);

  React.useEffect(() => {
    if (id === handledRoute) return;
    const timeout = setTimeout(() => setHandledRoute(id), duration);
    return () => clearTimeout(timeout);
  }, [id, handledRoute, duration]);

  return (
    <Context.Provider value={id !== handledRoute}>{children}</Context.Provider>
  );
};
