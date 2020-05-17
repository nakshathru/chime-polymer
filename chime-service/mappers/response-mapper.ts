
export const response=(data)=>{
    const {code,body={}}=data;
    return {
        statusCode: code,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body),
        isBase64Encoded: false
      };
}