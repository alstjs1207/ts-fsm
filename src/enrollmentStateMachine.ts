// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Enrollment<STATE, EVENT> {
  fromState: STATE;
  event: EVENT;
  toState: STATE;
}

export function enrollmentFrom<STATE, EVENT>(
  fromState: STATE,
  event: EVENT,
  toState: STATE,
): Enrollment<STATE, EVENT> {
  return { fromState, event, toState };
}

export class EnrollmentStateMachine<STATE, EVENT> {
  protected current: STATE;

  constructor(
    initState: STATE,
    protected enrollments: Enrollment<STATE, EVENT>[] = [],
  ) {
    this.current = initState;
  }

  addTransitions(enrollments: Enrollment<STATE, EVENT>[]): void {
    enrollments.forEach((enrollment) => this.enrollments.push(enrollment));
  }

  getState(): STATE {
    return this.current;
  }

  can(event: EVENT): boolean {
    return this.enrollments.some(
      (enrollment) => enrollment.fromState === this.current && enrollment.event === event,
    );
  }

  isFinal(): boolean {
    // search for a transition that starts from current state.
    // if none is found it's a terminal state.
    return this.enrollments.every((enrollment) => enrollment.fromState !== this.current);
  }

  dispatch(event: EVENT): boolean {
    const found = this.enrollments.some((enrollment) => {
      if (enrollment.fromState === this.current && enrollment.event === event) {
        this.current = enrollment.toState;
        return true;
      }
      return false;
    });

    if (!found) {
      console.error(`no transition: from ${this.current} event ${event}`);
      throw new Error();
    }
    return found;
  }
}
