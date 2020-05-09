let duration: number = 0; //seconds
let interval: NodeJS.Timeout | null;
interface EventHandlers {
  onChange: (time: string) => void;
  onEnd: () => void;
}
function isTimerRunning() {
  return !!interval;
}
function startTimer(duration: number, { onChange, onEnd }: EventHandlers) {
  if (interval) {
    throw new Error("Timer is already running");
  }
  setDuration(duration);
  interval = setInterval(() => {
    onChange(formatDuration(duration));
    if (duration <= 0) {
      stopTimer();
      onEnd();
    } else {
      duration -= 1;
    }
  }, 1000);
}
function stopTimer() {
  stopInterval();
  duration = 0;
}
function pauseTimer() {
  if (!isTimerRunning()) {
    return;
  }
  stopInterval();
}
function stopInterval() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}
function setDuration(secs: number) {
  duration = secs;
}
function getFormattedDuration() {
  return formatDuration(duration);
}
function formatDuration(durationInSecs: number) {
  function addZero(time: number) {
    return time < 10 ? `0${time}` : time;
  }
  const hours = Math.floor(durationInSecs / 3600);
  const minutes = Math.floor((durationInSecs % 3600) / 60);
  const seconds = Math.floor(durationInSecs % 60);

  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}

export {
  isTimerRunning,
  startTimer,
  pauseTimer,
  stopTimer,
  setDuration,
  getFormattedDuration,
};
