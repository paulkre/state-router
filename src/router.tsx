import React from "react";

export type RouteData = Record<string, unknown>;

type StateRouterState<T extends RouteData = RouteData> = {
  routeID: string | null;
  prevRouteID: string | null;
  routeData: Record<string, T>;
};

type Props = {
  routeID: string | null;
  routeData: RouteData;
};

const initialState: StateRouterState = {
  routeID: null,
  prevRouteID: null,
  routeData: {},
};

const Context = React.createContext<StateRouterState>(initialState);

export const RouterContextProvider = Context.Provider;

export function useRouterState(): StateRouterState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = RouteData>(
  layout: string
): T | null {
  const { routeData: layoutData } = useRouterState();
  return React.useMemo(() => (layoutData[layout] as T) || null, [
    layout,
    layoutData,
  ]);
}

export const StateRouter: React.FC<Props> = ({
  children,
  routeID,
  routeData,
}) => {
  const [
    handledRouteData,
    setHandledRouteData,
  ] = React.useState<RouteData | null>(null);

  const [state, setState] = React.useState<StateRouterState>(() => {
    const initState: StateRouterState = {
      ...initialState,
      routeID,
    };
    if (routeID) initState.routeData = { [routeID]: routeData };

    return initState;
  });

  React.useEffect(() => {
    if (routeID === state.routeID && routeData === handledRouteData) return;

    const newState: StateRouterState = {
      ...state,
      prevRouteID: state.routeID,
      routeID: routeID,
    };

    if (routeID)
      newState.routeData = {
        ...state.routeData,
        [routeID]: routeData,
      };

    setState(newState);
    setHandledRouteData(routeData);
  }, [handledRouteData, state, routeID, routeData]);

  return state.routeID ? (
    <RouterContextProvider value={state}>{children}</RouterContextProvider>
  ) : (
    <>{children}</>
  );
};
