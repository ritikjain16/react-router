import type { History, Location, Action } from "../../history";

import { execSteps } from "./utils";

export default function BlockEverything(history: History, done: () => void) {
  let steps: Step[] = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: "/",
      });

      let unblock = history.block(() => void 0);

      history.push("/home");

      expect(history.location).toMatchObject({
        pathname: "/",
      });

      unblock();
    },
  ];

  execSteps(steps, history, done);
}

type Step = (...args: Array<{ location: Location; action: Action }>) => void;
