import React from "react";
import { animate } from "framer-motion";
import { useLayerState } from "./layout-layer";

type MoveConfig = {
  a: HTMLElement;
  b: HTMLElement;
  imageURL: string;
  duration?: number;
};

type ImageDefinition = {
  elem: HTMLElement;
  rect: DOMRect;
};

const Context = React.createContext<{
  scheduleMove(config: MoveConfig): void;
}>({ scheduleMove() {} });

export function useMediaMover() {
  return React.useContext(Context);
}

export const MediaMover: React.FC = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const configsRef = React.useRef<MoveConfig[]>([]);
  const { transition } = useLayerState();

  React.useEffect(() => {
    if (configsRef.current.length! || !transition || !transition.entering)
      return;

    const anims = configsRef.current.map(({ a, b, imageURL, duration }) => {
      a.style.opacity = b.style.opacity = "0";

      const img = document.createElement("img");
      img.setAttribute("class", "absolute object-cover");
      img.src = imageURL;
      containerRef.current!.appendChild(img);

      const { scrollX, scrollY } = window;

      const elems: ImageDefinition[] = [a, b].map((elem) => {
        return {
          elem,
          rect: elem.getBoundingClientRect(),
        };
      });

      function updateImagePosition(t: number) {
        const [{ rect: a }, { rect: b }] = elems;

        img.style.top = `${
          a.top + t * (b.top - a.top) + scrollY - window.scrollY
        }px`;
        img.style.left = `${
          a.left + t * (b.left - a.left) + scrollX - window.scrollX
        }px`;
        img.style.width = `${a.width + t * (b.width - a.width)}px`;
        img.style.height = `${a.height + t * (b.height - a.height)}px`;
      }

      updateImagePosition(0);

      return animate(0, 1, {
        duration: duration || 0.6,
        onUpdate(t) {
          updateImagePosition(t);
        },
        onComplete() {
          img.remove();
          a.style.opacity = b.style.opacity = "1";
        },
      });
    });

    configsRef.current = [];

    return () => anims.forEach((anim) => anim.stop());
  }, [transition]);

  return (
    <Context.Provider
      value={{
        scheduleMove: React.useCallback((config) => {
          configsRef.current = [...configsRef.current, config];
        }, []),
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-20"
        ref={containerRef}
      />
      {children}
    </Context.Provider>
  );
};
