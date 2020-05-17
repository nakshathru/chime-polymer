import { CloudWatchLogs } from 'aws-sdk'
const cloudWatchClient = new CloudWatchLogs({ apiVersion: process.env.API_VERSION });
const logGroupName = process.env.BROWSER_LOG_GROUP_NAME || '';

export const uploadLogEvents = async (body) => {
    const logStreamName = `ChimeSDKMeeting_${body.meetingId.toString()}`;
    const logEvents:any = [];
    const putLogEventsInput = {
        logGroupName: logGroupName,
        logStreamName: logStreamName,
        sequenceToken: '',
        logEvents: logEvents
    };
    const uploadSequence = await ensureLogStream(cloudWatchClient, logStreamName);
    if (uploadSequence) {
        putLogEventsInput.sequenceToken = uploadSequence;
    }
    for (let i = 0; i < body.logs.length; i++) {
        const log = body.logs[i];
        const timestamp = new Date(log.timestampMs).toISOString();
        const message = `${timestamp} [${log.sequenceNumber}] [${log.logLevel}] [meeting: ${body.meetingId.toString()}] [attendee: ${body.attendeeId}]: ${log.message}`;
        logEvents.push({
            message: message,
            timestamp: log.timestampMs
        });
    }
    putLogEventsInput.logEvents = logEvents;
    return await cloudWatchClient.putLogEvents(putLogEventsInput).promise();
}

const ensureLogStream = async (cloudWatchClient, logStreamName) => {
    const logStreamsResult = await cloudWatchClient.describeLogStreams({
        logGroupName: logGroupName,
        logStreamNamePrefix: logStreamName,
    }).promise();
    const foundStream = logStreamsResult.logStreams.find(s => s.logStreamName === logStreamName);
    if (foundStream) {
        return foundStream.uploadSequenceToken;
    }
    await cloudWatchClient.createLogStream({
        logGroupName: logGroupName,
        logStreamName: logStreamName,
    }).promise();
    return null;
}