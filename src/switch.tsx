import React from "react";

import { useRouterState } from "./router";
import { useRouteState, RouteContextProvider, RouteState } from "./route";
import { useTransitioning } from "./transition-manager";

const nonActiveStyles: React.CSSProperties = { pointerEvents: "none" };

export const RouteSwitch: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  const { id: currentId } = useRouterState();
  const route = useRouteState();
  const isTransitioning = useTransitioning();

  const [prerunScheduled, setPrerunScheduled] = React.useState(
    route?.id !== currentId
  );
  React.useLayoutEffect(() => {
    if (route?.id !== currentId) setPrerunScheduled(true);
    else setTimeout(() => setPrerunScheduled(false));
  }, [route, currentId]);

  const changedState = React.useMemo<RouteState | null>(
    () =>
      route && {
        ...route,
        active: isTransitioning && prerunScheduled ? false : route.active,
      },
    [route, isTransitioning, prerunScheduled]
  );

  return (
    <div
      className={className}
      style={prerunScheduled || !route?.active ? nonActiveStyles : undefined}
    >
      <RouteContextProvider value={changedState}>
        {route?.visible && children}
      </RouteContextProvider>
    </div>
  );
};
