import {
  IAttribute,
  ITransformDynamoAttributesToItem,
  ITransformDynamoUnProcessedItemsInput,
} from '../interfaces';

export const transformAttributeValuesInDynamoFormat = (
  AttributeValues: IAttribute[],
) => {
  if (AttributeValues) {
    const ExpressionAttributeValues = {};

    AttributeValues.forEach((attributeValueData) => {
      ExpressionAttributeValues[attributeValueData.name] = {
        [attributeValueData.type]: attributeValueData.value,
      };
    });

    return ExpressionAttributeValues;
  }

  return;
};

export const transformDynamoAttributesToItem = (
  attributes: ITransformDynamoAttributesToItem,
) => {
  const item = {};

  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const attributeValues = attributes[key];
      const value = Object.values(attributeValues)[0];
      item[key] = value;
    }
  }

  return item;
};

export function transformDeleteRequestUnprocessedItems<KeyAttributes>(
  input: ITransformDynamoUnProcessedItemsInput,
) {
  const { table, unprocessedDynamoItems } = input;

  const unprocessedItems = [];

  unprocessedDynamoItems[table]?.forEach((unprocessedDynamoItem) => {
    const primaryKey = unprocessedDynamoItem.DeleteRequest.Key;

    const itemKey = {};
    for (const attribute in primaryKey) {
      const [attributeValue] = Object.values(primaryKey[attribute]);

      itemKey[attribute] = attributeValue;
    }
    unprocessedItems.push(itemKey);
  });

  return unprocessedItems as KeyAttributes[];
}
