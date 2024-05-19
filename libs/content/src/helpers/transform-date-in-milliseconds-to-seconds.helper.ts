export const transformDateInMillisecondsInSeconds = (
  dateInMilliseconds: number,
) => {
  const currentTime = Date.now();
  const differenceInMilliseconds = dateInMilliseconds - currentTime;
  if (differenceInMilliseconds < 0) {
    return 0;
  }

  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  return differenceInSeconds;
};
