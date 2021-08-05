import React from "react";

import { useRouteState, RouteState } from "./route";

const nonActiveStyles: React.CSSProperties = { pointerEvents: "none" };

const defaultState: Pick<RouteState, "active" | "visible"> = {
  active: false,
  visible: false,
};

export const RouteSwitch: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  const { active, visible } = useRouteState() || defaultState;

  return (
    <div className={className} style={!active ? nonActiveStyles : undefined}>
      {visible && children}
    </div>
  );
};
