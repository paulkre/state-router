import React from "react";

export type RouteData = Record<string, unknown>;

type StateRouterState<T extends RouteData = RouteData> = {
  id: string | null;
  prevId: string | null;
  data: T | null;
  dataCache: { [id in string]?: T | null };
};

type Props = {
  id: string | null;
  data: RouteData | null;
};

const initialState: StateRouterState = {
  id: null,
  prevId: null,
  data: null,
  dataCache: {},
};

const Context = React.createContext<StateRouterState>(initialState);

export const RouterContextProvider = Context.Provider;

export function useRouterState(): StateRouterState {
  return React.useContext(Context);
}

export function useRouteData<T extends RouteData = RouteData>(
  id: string | null
): T | null {
  const { dataCache } = useRouterState();
  return React.useMemo(
    () => (id && (dataCache[id] as T | undefined | null)) || null,
    [id, dataCache]
  );
}

export const StateRouter: React.FC<Props> = ({ children, id, data }) => {
  const [handledData, setHandledData] = React.useState<RouteData | null>(null);

  const [state, setState] = React.useState<StateRouterState>(() =>
    id
      ? {
          id,
          prevId: null,
          data,
          dataCache: { [id]: data },
        }
      : initialState
  );

  React.useEffect(() => {
    const newData = id ? data : null;
    if (id === state.id && newData === handledData) return;

    const newState: StateRouterState = {
      ...state,
      prevId: state.id,
      id: id,
      data: newData,
    };

    if (id)
      newState.dataCache = {
        ...state.dataCache,
        [id]: newData,
      };

    setState(newState);
    setHandledData(newData);
  }, [handledData, state, id, data]);

  return (
    <RouterContextProvider value={state}>{children}</RouterContextProvider>
  );
};
