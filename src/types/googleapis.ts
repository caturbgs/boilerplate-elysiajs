import type { auth, sheets_v4 } from "@googleapis/sheets";

export type ValuesRangeGoogleSheets = sheets_v4.Schema$ValueRange;
export type JWT = (typeof auth.JWT)["prototype"];
export type Credentials = (typeof auth.JWT)["prototype"]["credentials"];
export type Auth = {
  jwt: JWT;
  credentials: Credentials;
};
