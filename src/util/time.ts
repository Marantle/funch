import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Callback,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'

export const timestamp: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent,
  _context: Context,
  _callback: Callback<APIGatewayProxyResult>
) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: String(Math.floor(Date.now() / 1000)),
  }
  return response
}
