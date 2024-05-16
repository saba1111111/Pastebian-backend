import { ContentTableAttributes } from 'libs/database/constants';
import { ICreateContentPrimaryKeyCredentials } from '../interfaces';

export const createContentItemPrimaryKey = (
  input: ICreateContentPrimaryKeyCredentials,
) => {
  const { id, expireAt } = ContentTableAttributes;

  return [
    { column: id.name, value: input.id, type: id.type },
    {
      column: expireAt.name,
      value: input.expireAt,
      type: expireAt.type,
    },
  ];
};
