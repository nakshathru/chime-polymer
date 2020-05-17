
import { response } from "../mappers/response-mapper";
import { uploadLogEvents } from "../controllers/cloudwatch-controller";

export const logs = async (event) => {
    const body = JSON.parse(event.body);
    if (!body.logs || !body.meetingId || !body.attendeeId || !body.appName) {
        return response({ code: 400, body: { error: 'Need properties: logs, meetingId, attendeeId, appName' } })
    } else if (!body.logs.length) {
        return response({ code: 200, body: {} })
    }
    try {
        await uploadLogEvents(body);
        return response({ code: 200, body: {} })
    }
    catch (error) {
        console.log(error);
        return response({ code: 400, body: { error: 'Cloudwatch events upload failed' } })
    }

}

export const sqs = (event) => {
    console.log(event.Records);
    return {};
}