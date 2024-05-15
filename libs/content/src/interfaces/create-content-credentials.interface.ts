export interface ICreateContentCredentials {
  content: string;
}

export interface ICreateContentDbCredentials extends ICreateContentCredentials {
  id: string;
  expireAt: number;
}

export interface ICreateContentServiceCredentials
  extends ICreateContentCredentials {
  expireAt: Date;
}
