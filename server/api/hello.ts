import type { IncomingMessage, ServerResponse } from 'http'

export default (req: IncomingMessage, res: ServerResponse) => {
  return {
    message: 'Hello World',
    abc: 789
  }
}