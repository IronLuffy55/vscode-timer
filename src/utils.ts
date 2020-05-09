export const isNumber = (value: string) => {
  return !Number.isNaN(Number.parseFloat(value));
};
export const isUnitOfTime = (char: string) => {
  return ["h", "m", "s"].includes(char.toLowerCase());
};
export const toInt = (time: string): number => {
  return Number.parseInt(time) || 0;
};
export const toSeconds = (time: string): number => {
  const [value, unit] = time.match(/[0-9]+|[hms]/g) || [];
  if (!isNumber(value) || (unit && !isUnitOfTime(unit))) {
    return 0;
  }
  switch (unit) {
    case "h":
      return toInt(value) * 3600;
    case "s":
      return Number.parseInt(value);
    case "m":
    default:
      //assuming minutes
      return toInt(value) * 60;
  }
};
export const isValidDurationStr = (parts: RegExpMatchArray) => {
  //valid duration strings are:
  //1.  raw number (assumed to be in minutes)
  //2.  raw number followed by h/m/s and only 1 occurence of h/m/s
  const { h, m, s, invalid } = parts.reduce(
    (acc, time) => {
      if (acc.invalid) {
        return acc;
      }
      if (/^[0-9]+h$/.test(time)) {
        acc.h = acc.h + 1;
      } else if (/^[0-9]+m$/.test(time)) {
        acc.m = acc.m + 1;
      } else if (/^[0-9]+s$/.test(time)) {
        acc.s = acc.s + 1;
      } else if (isNumber(time)) {
        acc.m = acc.m + 1;
      } else {
        acc.invalid = true;
      }
      return acc;
    },
    { h: 0, m: 0, s: 0, invalid: false }
  );
  if (h > 1 || m > 1 || s > 1 || invalid) {
    return false;
  }
  return true;
};
export const parseDurationStr = (input: string): number => {
  const parts = input.match(/[0-9]+[hms]?/g);
  if (!parts || parts.length > 3 || !isValidDurationStr(parts)) {
    //invalid input
    return 0;
  } else if (parts.length === 1) {
    //unitless numbers are assumed to be minutes
    return toSeconds(parts[0]);
  } else {
    return parts.reduce((sum, part) => sum + parseDurationStr(part), 0);
  }
};
