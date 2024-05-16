import { IAttribute, ITransformDynamoAttributesToItem } from '../interfaces';

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
