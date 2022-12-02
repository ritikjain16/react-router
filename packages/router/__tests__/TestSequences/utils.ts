import type { Action, History, Location } from "../../history";

export function execSteps(
  steps: Step[],
  history: History,
  done: (...args: any[]) => void
) {
  let index = 0,
    unlisten: () => void,
    cleanedUp = false;

  function cleanup(...args: any[]) {
    if (!cleanedUp) {
      cleanedUp = true;
      unlisten();
      done(...args);
    }
  }

  function execNextStep(...args: { action: Action; location: Location }[]) {
    try {
      let nextStep = steps[index++];
      if (!nextStep) throw new Error("Test is missing step " + index);

      nextStep(...args);

      if (index === steps.length) cleanup();
    } catch (error) {
      cleanup(error);
    }
  }

  if (steps.length) {
    unlisten = history.listen(execNextStep);

    execNextStep({
      action: history.action,
      location: history.location,
    });
  } else {
    done();
  }
}

type Step = (...args: Array<{ location: Location; action: Action }>) => void;
