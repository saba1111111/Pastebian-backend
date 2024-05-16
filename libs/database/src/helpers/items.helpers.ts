import { IAttribute, IExpressionAttributeValue } from '../interfaces';

export const transformExpressionAttributeValues = (
  AttributeValues: IExpressionAttributeValue[],
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

export const transformAttributesToItem = (attributes: IAttribute[]) => {
  const Item = {};
  attributes.forEach((attribute) => {
    Item[attribute.column] = { [attribute.type]: attribute.value };
  });

  return Item;
};
