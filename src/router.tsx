import React from "react";

export type RouteData = Record<string, unknown>;

type StateRouterState<T extends RouteData = RouteData> = {
  id: string | null;
  prevId: string | null;
  data: { [id in string]?: T | null };
  currentData: T | null;
};

type Props = {
  id: string | null;
  data: RouteData | null;
};

const initialState: StateRouterState = {
  id: null,
  prevId: null,
  data: {},
  currentData: null,
};

const Context = React.createContext<StateRouterState>(initialState);

export const RouterContextProvider = Context.Provider;

export function useRouterState(): StateRouterState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = RouteData>(
  id: string
): T | null {
  const { data: routeData } = useRouterState();
  return React.useMemo(() => (routeData[id] as T | undefined | null) || null, [
    id,
    routeData,
  ]);
}

export const StateRouter: React.FC<Props> = ({ children, id, data }) => {
  const [handledData, setHandledData] = React.useState<RouteData | null>(null);

  const [state, setState] = React.useState<StateRouterState>(() => {
    const initState: StateRouterState = {
      ...initialState,
      id: id,
    };
    if (id) {
      initState.data = { [id]: data };
      initState.currentData = data;
    }

    return initState;
  });

  React.useEffect(() => {
    const currentData = id ? data : null;
    if (id === state.id && currentData === handledData) return;

    const newState: StateRouterState = {
      ...state,
      prevId: state.id,
      id: id,
      currentData,
    };

    if (id)
      newState.data = {
        ...state.data,
        [id]: currentData,
      };

    setState(newState);
    setHandledData(data);
  }, [handledData, state, id, data]);

  return (
    <RouterContextProvider value={state}>{children}</RouterContextProvider>
  );
};
