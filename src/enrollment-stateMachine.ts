import type { Enrollment } from "./enrollment-stateMachine.interface";

export function enrollmentFrom<STATE, EVENT>(
  fromState: STATE,
  event: EVENT,
  toState: STATE,
): Enrollment<STATE, EVENT> {
  return { fromState, event, toState };
}

export class EnrollmentStateMachine<STATE, EVENT> {
  protected state: STATE;

  constructor(
    initState: STATE,
    protected enrollments: Enrollment<STATE, EVENT>[] = [],
  ) {
    this.state = initState;
  }

  public addTransaction(enrollments: Enrollment<STATE, EVENT>[]): void {
    enrollments.forEach((enrollment) => this.enrollments.push(enrollment));
  }

  public getState(): STATE {
    return this.state;
  }

  public validateEnrollmentState(event: EVENT): boolean {
    return this.enrollments.some(
      (enrollment) => enrollment.fromState === this.state && enrollment.event === event,
    );
  }

  isFinal(): boolean {
    // search for a transition that starts from current state.
    // if none is found it's a terminal state.
    return this.enrollments.every((enrollment) => enrollment.fromState !== this.state);
  }

  public dispatch(event: EVENT): boolean {
    const found = this.enrollments.some((enrollment) => {
      if (enrollment.fromState === this.state && enrollment.event === event) {
        this.state = enrollment.toState;
        return true;
      }
      return false;
    });

    if (!found) {
      console.error(`no transaction: from ${this.state} event ${event}`);
      throw new Error();
    }
    return found;
  }
}
