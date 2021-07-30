import React from "react";
import cn from "classnames";

import { useRouteState } from "./route";

export const RouteSwitch: React.FC<{
  className?: string;
}> = ({ children, className }) => {
  const { active, visible } = useRouteState();

  return (
    <div className={cn(!active && "pointer-events-none", className)}>
      {visible && children}
    </div>
  );
};
