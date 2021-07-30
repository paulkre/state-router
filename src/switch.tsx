import React from "react";

import { useRouteState } from "./route";

const nonActiveStyles: React.CSSProperties = { pointerEvents: "none" };

export const RouteSwitch: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  const { active, visible } = useRouteState();

  return (
    <div className={className} style={!active ? nonActiveStyles : undefined}>
      {visible && children}
    </div>
  );
};
