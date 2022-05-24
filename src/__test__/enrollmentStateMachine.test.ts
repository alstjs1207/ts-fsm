import { enrollmentFrom, EnrollmentStateMachine } from "../enrollmentStateMachine";
import { EnrollmentStates, EnrollmentEvents } from "../enrollment.type";

class Enrollment extends EnrollmentStateMachine<EnrollmentStates, EnrollmentEvents> {

  constructor(init: EnrollmentStates = "pending") {

    super(init);

    this.addTransitions([
      enrollmentFrom("pending", "proposal", "applying"), // 대기 -> 수강신청 -> 수강신청 증
      enrollmentFrom("applying", "canceled", "pending"), // 수강신청 중 -> 취소 -> 대기
      enrollmentFrom("applying", "approved", "enrollment"), // 수강신청 중 -> 승인 -> 수강신청완료
      enrollmentFrom("applying", "rejected", "pending"), // 수강신청 중 -> 반려 -> 대기
      enrollmentFrom("enrollment", "canceled", "pending"), // 수강신청 완료 -> 취소 -> 대기
    ]);

  }

  // public methods
  proposal() { return this.dispatch("proposal"); }
  approved() { return this.dispatch("approved"); }
  rejected() { return this.dispatch("rejected"); }
  canceled() { return this.dispatch("canceled"); }

  isEnrollment(): boolean { return this.getState() === "enrollment"; }
  isApply(): boolean { return this.getState() === "applying"; }

}

describe("stateMachine tests", () => {

  test("test proposal enrollment", () => {
    const enrollment = new Enrollment();

    expect(enrollment.isApply()).toBeFalsy();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 대기 일 때만 수강신청 가능
    expect(enrollment.can("proposal")).toBeTruthy();

    enrollment.proposal();
    expect(enrollment.isApply()).toBeTruthy();
  });

  test("test not action pending ", () => {
    const enrollment = new Enrollment();
    expect(enrollment.can("approved")).toBeFalsy();
    expect(enrollment.can("rejected")).toBeFalsy();
    expect(enrollment.can("canceled")).toBeFalsy();

  });

  test("test a failed event", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.can("proposal")).toBeFalsy();
    expect(() => enrollment.proposal()).toThrow();
  });

  test("test a success event", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.can("approved")).toBeTruthy();
    expect(enrollment.can("rejected")).toBeTruthy();
    expect(enrollment.can("canceled")).toBeTruthy();
  });

  test("test approved enrollment", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.approved();
    expect(enrollment.isEnrollment()).toBeTruthy();
  });

  test("test rejected enrollment", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.rejected();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 반려 후 다시 수강신청이 가능하다.
    expect(enrollment.can("proposal")).toBeTruthy();
  });

  test("test canceled enrollment in applying", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.canceled();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 취소 후 다시 수강신청이 가능하다.
    expect(enrollment.can("proposal")).toBeTruthy();
  });

  test("test canceled enrollment", () => {
    const enrollment = new Enrollment("enrollment");
    expect(enrollment.isEnrollment()).toBeTruthy();

    enrollment.canceled();
    expect(enrollment.isEnrollment()).toBeFalsy();
  });

  test("test enrollment to proposal", () => {
    const enrollment = new Enrollment("enrollment");
    expect(enrollment.isEnrollment()).toBeTruthy();
    // await expect(enrollment.proposal()).rejects.toEqual({});
    expect(() => enrollment.proposal()).toThrow();

  });

});
