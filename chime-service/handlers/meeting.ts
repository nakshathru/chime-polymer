import {response} from '../mappers/response-mapper';
import {getMeeting} from '../controllers/dynamo-controller'
import { createMeeting, createAttendee, deleteMeeting } from '../controllers/meeting-controller';

export const join = async (event) => {
const { queryStringParameters } = event;
const { title , name, region} =queryStringParameters
if(!title || !name || !region){
  return response({code:400,body:{error: 'Missing parameters: title, name or region'}});
}
try{
  let meeting = await getMeeting(title);
  if(!meeting){
    meeting = await createMeeting({region:region,title:title});
  }
  const attendee = await createAttendee(meeting.Meeting.MeetingId,name);
  return response({code:200,body:{JoinInfo: {
    Meeting: meeting,
    Attendee: attendee,
  }}});
}
catch(error){
  console.error(error);
  return response({code:400,body:{error: 'Meeting creation failed'}})

}
};

export const end = async (event) => {
  const { queryStringParameters } = event;
  const { title=''} =queryStringParameters;
  const meeting = await getMeeting(title);
  const meetingId = meeting?.Meeting?.MeetingId || ''
  await deleteMeeting(meetingId);
  return response({code:200,body:{message:'Meeting ended'}})
  
}
