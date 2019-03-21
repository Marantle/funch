import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda'
import 'source-map-support/register'
import handleSlashEvent from 'src/slash/handleSlashEvent';


export const slash: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  return handleSlashEvent(event.body, event.headers)
}
