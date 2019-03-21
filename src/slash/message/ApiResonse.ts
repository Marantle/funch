import { WebAPICallResult } from "@slack/client";

export interface SlackApiResponse extends WebAPICallResult {
  ts:     string;
}