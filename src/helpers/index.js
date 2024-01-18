const timeDifferenceHandler = (time1, time2) => {
  const parseTime = (time) => {
      const matchResult = time.match(/(\d+):(\d+) (\w+)/);
      if (!matchResult) {
          throw new Error('Invalid time format');
      }

      const [_, hours, minutes, period] = matchResult;
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10), period };
  };

  const convertTo24Hour = (time) => {
      let { hours, minutes, period } = parseTime(time);
      if (period.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
      }
      return { hours, minutes };
  };

  const time1Obj = convertTo24Hour(time1);
  const time2Obj = convertTo24Hour(time2);

  let hourDiff = time2Obj.hours - time1Obj.hours;
  let minuteDiff = time2Obj.minutes - time1Obj.minutes;

  if (minuteDiff < 0) {
      hourDiff--;
      minuteDiff += 60;
  }

  return `${hourDiff} Hours ${minuteDiff} Minutes`;
}

export { timeDifferenceHandler }