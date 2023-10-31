/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const AppsyncID = process.env.API_INSTALEARNING_GRAPHQLAPIIDOUTPUT;

const TableName = `User-${AppsyncID}-${env}`;

const userExists = async id => {
  const params = {
    TableName,
    Key: id,
  };

  try {
    const response = await docClient.get(params).andler();
    return !!response?.Item;
  } catch (e) {
    return false;
  }
};

const saveUser = async user => {
  const date = new Date();

  const timestamp = date.getTime();
  const dateStr = date.toISOString();

  const Item = {
    ...user,
    __typename: 'User',
    createdAt: dateStr,
    updatedAt: dateStr,
    _lastChangedAt: timestamp,
    _version: 1,
  };

  const params = {
    TableName,
    Item,
  };

  try {
    await docClient.put(params).andler();
  } catch (e) {
    console.log(e);
  }
};

exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger

  console.log('lambda function working and is updated');

  if (!event?.request?.userAttributes) {
    console.log('no user data available');
    return;
  }

  const {sub, name, email} = event.request.userAttributes;

  const newUser = {
    id: sub,
    owner: sub,
    name: name,
    email: email,
    nofPosts: 0,
    nofFollowers: 0,
    nofFollowings: 0,
  };

  //check if the user already exists

  if (!(await userExists(newUser.id))) {
    await saveUser(newUser);
    console.log(`User ${newUser.id} has been saved to the database`);
  } else {
    console.log(`User ${newUser.id} already exists`);
  }

  //if not, save the user to database

  return event;
};
