import React from "react";

export type RouteData = Record<string, unknown>;

type StateRouterState<T extends RouteData = RouteData> = {
  id: string | null;
  prevId: string | null;
  routeData: Record<string, T>;
};

type Props = {
  id: string | null;
  data: RouteData;
};

const initialState: StateRouterState = {
  id: null,
  prevId: null,
  routeData: {},
};

const Context = React.createContext<StateRouterState>(initialState);

export const RouterContextProvider = Context.Provider;

export function useRouterState(): StateRouterState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = RouteData>(
  id: string
): T | null {
  const { routeData } = useRouterState();
  return React.useMemo(() => (routeData[id] as T) || null, [id, routeData]);
}

export const StateRouter: React.FC<Props> = ({ children, id, data }) => {
  const [
    handledRouteData,
    setHandledRouteData,
  ] = React.useState<RouteData | null>(null);

  const [state, setState] = React.useState<StateRouterState>(() => {
    const initState: StateRouterState = {
      ...initialState,
      id: id,
    };
    if (id) initState.routeData = { [id]: data };

    return initState;
  });

  React.useEffect(() => {
    if (id === state.id && data === handledRouteData) return;

    const newState: StateRouterState = {
      ...state,
      prevId: state.id,
      id: id,
    };

    if (id)
      newState.routeData = {
        ...state.routeData,
        [id]: data,
      };

    setState(newState);
    setHandledRouteData(data);
  }, [handledRouteData, state, id, data]);

  return state.id ? (
    <RouterContextProvider value={state}>{children}</RouterContextProvider>
  ) : (
    <>{children}</>
  );
};
