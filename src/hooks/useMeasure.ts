import * as React from "react";

export default (element: HTMLElement, dependencies: Array<any> = []) => {
  const [state, setState] = React.useState<DOMRect>();
  const rafRef = React.useRef<number>();

  const cancelRaf = React.useCallback(id => cancelAnimationFrame(id), []);
  React.useEffect(() => {
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setState(rect);
    };
    rafRef.current = requestAnimationFrame(measure);

    () => cancelRaf(rafRef.current);
  }, dependencies);

  return state;
};
