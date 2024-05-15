import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { IPutItemCredentials } from '../interfaces';

export const putItem = (input: IPutItemCredentials) => {
  const { Attributes, ExpressionAttributeValuesList, ...rest } = input;

  const Item = {};
  Attributes.forEach((attribute) => {
    Item[attribute.column] = { [attribute.type]: attribute.value };
  });

  let ExpressionAttributeValues = null;
  if (ExpressionAttributeValuesList) {
    ExpressionAttributeValues = {};
    ExpressionAttributeValuesList.forEach((attributeValueData) => {
      ExpressionAttributeValues[attributeValueData.name] = {
        [attributeValueData.type]: attributeValueData.value,
      };
    });
  }

  return new PutItemCommand({ Item, ExpressionAttributeValues, ...rest });
};
