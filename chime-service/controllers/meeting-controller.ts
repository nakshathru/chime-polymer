import {Chime,Endpoint} from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { putMeeting } from './dynamo-controller';
const chime = new Chime({ region: process.env.REGION });
chime.endpoint = new Endpoint('https://service.chime.aws.amazon.com');
const sqsQueueArn = process.env.SQS_QUEUE_ARN;
const useSqsInsteadOfEventBridge = process.env.USE_EVENT_BRIDGE === 'false';

export const createMeeting=async (params)=>{
const {region,title}=params
const request={
    ClientRequestToken: uuid(),
    MediaRegion:region,
    NotificationsConfiguration: useSqsInsteadOfEventBridge ? { SqsQueueArn: sqsQueueArn } : {},
}
console.info('Creating new meeting: ' + JSON.stringify(request));
try{
    const meeting = await chime.createMeeting(request).promise();
    await putMeeting(title,meeting);
    return meeting;

}catch(error){
    console.log('Meeting creation failed',error);
    throw(error)
}
}

export const createAttendee=async (meetingId,name)=>{
    const request={
        MeetingId: meetingId,
        ExternalUserId: `${uuid().substring(0, 8)}#${name}`.substring(0, 64)
    }
    try{
        return await chime.createAttendee(request).promise();
    }catch(error){
        console.log('Attendee creation failed');
        throw(error)
    }
}

export const deleteMeeting = async(meetingId)=>{

    return await chime.deleteMeeting({MeetingId:meetingId}).promise()

}