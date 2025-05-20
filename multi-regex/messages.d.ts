import type { RequestBody, RequestResponse } from "~background/messages/open-ai"

declare module "@plasmohq/messaging" {
  interface PlasmoMessaging {
    "openAi": {
      req: RequestBody
      res: RequestResponse
    }
  }
}
