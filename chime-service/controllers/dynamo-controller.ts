import {DynamoDB} from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient({region:process.env.REGION});
const meetingTable=process.env.MEETINGS_TABLE_NAME || ''

export const getMeeting= async (title)=>{
  console.log('inside get meeting ',title,meetingTable);
  
    const result = await documentClient.get({
        TableName: meetingTable,
        Key: {
          'Title': title,
        },
      }).promise();
      return result.Item ? JSON.parse(result.Item.Data) : null;

}

export const putMeeting=async (title, meeting)=>{
    await documentClient.put({
        TableName:meetingTable,
        Item: {
          'Title': title ,
          'Data': JSON.stringify(meeting) ,
          'TTL': {
            N: `${Math.floor(Date.now() / 1000) + 60 * 60 * 24}`
          }
        }
       
      }).promise();
}