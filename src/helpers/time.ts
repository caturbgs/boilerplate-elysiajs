export async function delay(waitTime: number) {
  // create function delay using settimeout with promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, waitTime);
  });
}
