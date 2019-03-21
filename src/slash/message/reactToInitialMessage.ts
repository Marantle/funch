import Axios from 'axios'
import { ReactionsAddArguments } from '@slack/client';
import { SlackApiResponse } from 'src/slash/message/ApiResonse';


const reactCurry = msgBody => emoji =>
  Axios.post<SlackApiResponse>('https://slack.com/api/reactions.add', {
    ...msgBody,
    name: emoji,
  })

export default async (channelId: string, timestamp: string): Promise<void> => {
  const msgBody: ReactionsAddArguments = {
    channel: channelId,
    timestamp: timestamp,
    name: ''
  }
  const react = reactCurry(msgBody)

  const reacts = [
    react('clock11'),
    react('clock1130'),
    react('clock12'),
    react('clock1230'),
  ]
  const results = await Axios.all(reacts)
  const success = results.every(r => r.status === 200)
  if (!success) {
    const errors = results.filter(r => r.status !== 200).map(r => r.statusText)
    throw `errors reacting to posted message ${errors}`
  }
}
