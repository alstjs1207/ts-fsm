import { Enrollment } from "../enrollment";

describe("수강신청 stateMachine tests", () => {

  test("대기상태에서는 승인/반려/취소 할 수 없다.", () => {
    const enrollment = new Enrollment();
    expect(enrollment.validateEnrollmentState("approved")).toBeFalsy();
    expect(enrollment.validateEnrollmentState("rejected")).toBeFalsy();
    expect(enrollment.validateEnrollmentState("canceled")).toBeFalsy();
  });

  test("수강신청 중에는 승인/반려/취소 할 수 있다.", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.validateEnrollmentState("approved")).toBeTruthy();
    expect(enrollment.validateEnrollmentState("rejected")).toBeTruthy();
    expect(enrollment.validateEnrollmentState("canceled")).toBeTruthy();
  });

  test("수강신청 중인 경우 다시 수강신청을 할 수 없다.", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.validateEnrollmentState("proposal")).toBeFalsy();
    expect(() => enrollment.proposal()).toThrow();
  });

  test("수강신청 프로세스", () => {
    const enrollment = new Enrollment();

    expect(enrollment.isApply()).toBeFalsy();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 대기 일 때만 수강신청 가능
    expect(enrollment.validateEnrollmentState("proposal")).toBeTruthy();
    console.log(enrollment.getState());

    enrollment.proposal();
    console.log(enrollment.getState());
    expect(enrollment.isApply()).toBeTruthy();
  });

  test("수강신청 승인 프로세스", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.approved();
    expect(enrollment.isEnrollment()).toBeTruthy();
  });

  test("수강신청 반려 프로세스", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.rejected();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 반려 후 다시 수강신청이 가능하다.
    expect(enrollment.validateEnrollmentState("proposal")).toBeTruthy();
  });

  test("수강신청 취소 프로세스", () => {
    const enrollment = new Enrollment("applying");
    expect(enrollment.isApply()).toBeTruthy();

    enrollment.canceled();
    expect(enrollment.isEnrollment()).toBeFalsy();
    // 취소 후 다시 수강신청이 가능하다.
    expect(enrollment.validateEnrollmentState("proposal")).toBeTruthy();
  });

  test("수강신청 완료 후 취소 프로세스", () => {
    const enrollment = new Enrollment("enrollment");
    expect(enrollment.isEnrollment()).toBeTruthy();

    enrollment.canceled();
    expect(enrollment.isEnrollment()).toBeFalsy();
  });

  test("수강신청 완료 후 다시 수강신청 할 수 없다.", () => {
    const enrollment = new Enrollment("enrollment");
    expect(enrollment.isEnrollment()).toBeTruthy();
    expect(() => enrollment.proposal()).toThrow();
  });

});
