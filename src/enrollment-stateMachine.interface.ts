// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Enrollment<STATE, EVENT> {
  fromState: STATE;
  event: EVENT;
  toState: STATE;
}
