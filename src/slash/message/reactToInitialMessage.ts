import Axios from "axios";
import { ReactionsAddArguments } from "@slack/client";
import { SlackApiResponse } from "src/slash/message/ApiResonse";

const reactCurry = msgBody => emoji => {
  return Axios.post<SlackApiResponse>("https://slack.com/api/reactions.add", {
    ...msgBody,
    name: emoji
  });
};

export default async (channelId: string, timestamp: string): Promise<void> => {
  console.log("reacting to message");
  const msgBody: ReactionsAddArguments = {
    channel: channelId,
    timestamp: timestamp,
    name: ""
  };
  const react = reactCurry(msgBody);

  const emojis = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "clock11",
    "clock1130",
    "clock12",
    '💩'
  ];
  const errors = [];
  for (const emoji of emojis) {
    const response = await react(emoji);
    const success = response.status === 200;
    if (!success) {
      errors.push(response.statusText);
    }
  }
  
  if (errors.length > 0) {
    throw `errors reacting to posted message ${errors}`;
  }
};
