import { enrollmentFrom, EnrollmentStateMachine } from "./enrollment-stateMachine";
import { EnrollmentState, EnrollmentEvent } from "./enrollment.type";

export class Enrollment extends EnrollmentStateMachine<EnrollmentState, EnrollmentEvent> {

  constructor(init: EnrollmentState = "pending") {

    super(init);

    this.addTransaction([
      enrollmentFrom("pending", "proposal", "applying"), // 대기 -> 수강신청 -> 수강신청 증
      enrollmentFrom("applying", "canceled", "pending"), // 수강신청 중 -> 취소 -> 대기
      enrollmentFrom("applying", "approved", "enrollment"), // 수강신청 중 -> 승인 -> 수강신청완료
      enrollmentFrom("applying", "rejected", "pending"), // 수강신청 중 -> 반려 -> 대기
      enrollmentFrom("enrollment", "canceled", "pending"), // 수강신청 완료 -> 취소 -> 대기
    ]);

  }

  proposal() { return this.dispatch("proposal"); }
  approved() { return this.dispatch("approved"); }
  rejected() { return this.dispatch("rejected"); }
  canceled() { return this.dispatch("canceled"); }

  isEnrollment(): boolean {
    return this.getState() === "enrollment";
  }

  isApply(): boolean {
    return this.getState() === "applying";
  }

}
