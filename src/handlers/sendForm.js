import AWS from "aws-sdk";
import createError from "http-errors";

const sns = new AWS.SNS({ apiVersion: "2012-11-05" });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

async function sendForm(event, context) {
  //
  const body = JSON.parse(event.body);

  if (!body.messageTitle) {
    return {
      statusCode: 400,
      body: "Incorrect params",
    };
  }

  try {
    let message = `Message Title: ${body.messageTitle} \nMessage: ${body.message} \nEmail: ${body.email} \nGuest Name: ${body.guestName} \nPhone: ${body.phone}`;

    // send to SNS
    await sns
      .publish({
        Subject: "Request Form",
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
      .promise();
    // send to SQS
    let params = {
      MessageBody: event.body,
      QueueUrl: process.env.MY_QUEUE_URL,
    };
    await sqs.sendMessage(params).promise();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  return {
    headers: {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    statusCode: 200,
    body: JSON.stringify("Success!"),
  };
}

export const handler = sendForm;
