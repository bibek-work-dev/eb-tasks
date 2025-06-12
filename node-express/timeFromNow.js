const now = new Date();
const fortyMinutesLater = new Date(now.getTime() + 40 * 60 * 1000);
console.log(fortyMinutesLater.toISOString());
