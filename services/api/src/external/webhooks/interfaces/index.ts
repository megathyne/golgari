export interface ICreateEmailParams {
  clientReportUrl: string;
  advisorReportUrl: string;
  version: string;
  respondentUid: string;
  respondentEmail: string;
  respondentFirstName: string;
  respondentLastName: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  disclosure: string;
  surveyTitle: string;
  outcome: string;
  tenantMap: { uid: string; tenantId: string };
}

export interface INotfyAdvisor {
  clientReportUrl: string;
  advisorReportUrl: string;
  version: string;
  respondentUid: string;
  respondentEmail: string;
  respondentFirstName: string;
  respondentLastName: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  disclosure: string;
  advisorTemplateId: number;
  surveyTitle: string;
  outcome: string;
  tenantMap: { uid: string; tenantId: string };
}

export interface INotfyClient {
  version: string;
  respondentUid: string;
  respondentEmail: string;
  respondentFirstName: string;
  respondentLastName: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  disclosure: string;
  clientReportUrl: string;
  advisorReportUrl: string;
  clientTemplateId: number;
  surveyTitle: string;
  outcome: string;
  tenantMap: { uid: string; tenantId: string };
}

export interface ISendNotifications {
  version: string;
  respondentUid: string;
  respondentEmail: string;
  respondentFirstName: string;
  respondentLastName: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  disclosure: string;
  clientReportUrl: string;
  advisorReportUrl: string;
  surveyType: string;
  outcome: string;
}
