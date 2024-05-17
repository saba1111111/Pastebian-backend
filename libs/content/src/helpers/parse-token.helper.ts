import { TExclusiveStartKey } from 'libs/database/interfaces';

export function parseToken(token: string): TExclusiveStartKey {
  try {
    const parsedToken = JSON.parse(token);

    return parsedToken;
  } catch (error) {
    return null;
  }
}
