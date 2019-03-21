

import { parse } from 'querystring'
import Axios from 'axios'
import { APIGatewayProxyEvent } from 'aws-lambda'
import postInitialMessage from 'src/slash/message/postInitialMessage';
import reactToInitialMessage from 'src/slash/message/reactToInitialMessage';
import { Slash } from 'src/slash/slashtype';

import botAccessToken from 'src/secret/bot'

Axios.defaults.headers.common['Authorization'] = `Bearer ${botAccessToken}`
Axios.defaults.headers.common['Content-type'] =
  'application/json; charset=UTF-8'

type Body = APIGatewayProxyEvent['body']
type Headers = APIGatewayProxyEvent['headers']

export default async (body: Body, headers: Headers) => {
  if (headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
    return { statusCode: 415, body: 'x-www-form-urlencoded required' }
  }

  const reqBody = (parse(body) as unknown) as Slash

  if ('channel_id' in reqBody) {
    const { channel_id: channelId } = reqBody
    try {
      const messageTimestamp = await postInitialMessage(channelId)
      await reactToInitialMessage(channelId, messageTimestamp);
    } catch (error) {
      console.error(error.message)
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }

  // all okay, send empty messages to supress slash reply
  return {
    statusCode: 200,
    body: '',
  }
}
