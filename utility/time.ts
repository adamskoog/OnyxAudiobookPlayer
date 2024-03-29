const pad = (n: number, z?: number): string => {
  z = z || 2;
  return (`00${n}`).slice(-z);
};

export const convertSecondsToMs = (s: number): number => {
  if (!s) return 0;
  return Math.round(s * 1000);
};

export const convertMsToSeconds = (ms: number): number => {
  if (!ms) return 0;
  return Math.round(ms / 1000);
};

const convertFromMs = (s: number): string => {
  const ms: number = s % 1000;
  s = (s - ms) / 1000;
  const secs: number = s % 60;
  s = (s - secs) / 60;
  const mins: number = s % 60;
  const hrs: number = (s - mins) / 60;

  let output = '';
  if (hrs > 0) output += `${hrs}:`;

  return `${output}${pad(mins)}:${pad(secs)}`;
};

const convertFromSeconds = (s: number): string => {
  const secs: number = s % 60;
  let hrs: number = s / 60;
  const mins: number = hrs % 60;
  hrs /= 60;
  hrs = parseInt(hrs.toString(), 10);

  let output = '';
  if (hrs > 0) output += `${hrs}:`;

  return `${output}${pad(parseInt(mins.toString(), 10))}:${pad(parseInt(secs.toString(), 10))}`;
};

export const formatTrackDisplay = (duration: number): string => convertFromMs(duration);

export const formatProgressLabel = (value: number): string => convertFromSeconds(value);

export const formatPlayerDisplay = (current: number, duration: number): string => `${convertFromSeconds(current)} / ${convertFromSeconds(duration)}`;
