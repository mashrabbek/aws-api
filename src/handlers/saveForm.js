import AWS from "aws-sdk";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function saveForm(event, context) {
  try {
    const body = JSON.parse(event.Records[0].body);

    const requestForm = {
      messageTitle: body.messageTitle,
      message: body.message,
      email: body.email,
      guestName: body.guestName,
      phone: body.phone,
    };

    let res = await dynamodb
      .put({
        TableName: process.env.FORM_TABLE_NAME,
        Item: requestForm,
      })
      .promise();

    //console.log({ res });
  } catch (err) {
    throw Error(err);
  }
}

export const handler = saveForm;
