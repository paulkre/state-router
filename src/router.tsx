import React from "react";

export type RouteData = Record<string, unknown>;

type StateRouterState<T extends RouteData = RouteData> = {
  route: string | null;
  prevRoute: string | null;
  routeData: Record<string, T>;
};

type Props = {
  routePath: string;
  routeData: RouteData;
  routes: RouteCollection;
};

export type RouteCollection = {
  [id in string]?: RegExp;
};

const initialState: StateRouterState = {
  route: null,
  prevRoute: null,
  routeData: {},
};

const Context = React.createContext<StateRouterState>(initialState);

export const RouterContextProvider = Context.Provider;

export function useRouterState(): StateRouterState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = Record<string, unknown>>(
  layout: string
): T | null {
  const { routeData: layoutData } = useRouterState();
  return React.useMemo(
    () => (layoutData[layout] as T) || null,
    [layout, layoutData]
  );
}

export const StateRouter: React.FC<Props> = ({
  children,
  routePath,
  routeData,
  routes,
}) => {
  const getRouteIDByPath = React.useCallback<(path: string) => string | null>(
    (path) => Object.keys(routes).find((id) => routes[id]!.test(path)) || null,
    [routes]
  );

  const [handledRouteData, setHandledRouteData] =
    React.useState<RouteData | null>(null);

  const [state, setState] = React.useState<StateRouterState>(() => {
    const id = getRouteIDByPath(routePath);

    const initState: StateRouterState = {
      ...initialState,
      route: id,
    };
    if (id) initState.routeData = { [id]: routeData };

    return initState;
  });

  React.useEffect(() => {
    const id = getRouteIDByPath(routePath);

    if (id === state.route && routeData === handledRouteData) return;

    const newState: StateRouterState = {
      ...state,
      prevRoute: state.route,
      route: id,
    };

    if (id)
      newState.routeData = {
        ...state.routeData,
        [id]: routeData,
      };

    setState(newState);
    setHandledRouteData(routeData);
  }, [handledRouteData, state, routePath, routeData, getRouteIDByPath]);

  return state.route ? (
    <RouterContextProvider value={state}>{children}</RouterContextProvider>
  ) : (
    <>{children}</>
  );
};

export function withStateRouter(
  Component: () => JSX.Element | null,
  routes: RouteCollection
) {
  const WrappedRouter: React.FC<Omit<Props, "routes">> = ({
    children,
    ...props
  }) => (
    <StateRouter {...props} routes={routes}>
      {children}
      <Component />
    </StateRouter>
  );

  return WrappedRouter;
}
