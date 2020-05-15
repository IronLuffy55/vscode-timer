import { formatDuration } from "./utils";
//#region types
interface EventHandlers {
  onChange: (time: string) => void;
  onEnd: () => void;
}
enum State {
  Running,
  Stopped,
  Paused,
  Idle,
}
//#endregion
//#region private variables
let duration: number = 0; //seconds
let interval: NodeJS.Timeout;
let state: State = State.Idle;
let _onChange: (time: string) => void;
let _onEnd: () => void;
//#endregion
function isTimerRunning() {
  return state === State.Running;
}
function startTimer(duration: number, { onChange, onEnd }: EventHandlers) {
  if (state === State.Running) {
    throw new Error("Timer is already running");
  }
  state = State.Running;
  _onChange = onChange;
  _onEnd = onEnd;
  setDuration(duration);
  startInterval();
}
function stopTimer() {
  if (![State.Running, State.Paused].includes(state)) {
    return;
  }
  state = State.Stopped;
  duration = 0;
  stopInterval();
}
function pauseTimer() {
  if (state !== State.Running) {
    return;
  }
  state = State.Paused;
  stopInterval();
}
function resumeTimer() {
  if (state !== State.Paused) {
    return;
  }
  state = State.Running;
  startInterval();
}
function toggleTimer() {
  switch (state) {
    case State.Running:
      pauseTimer();
      break;
    case State.Paused:
      resumeTimer();
      break;
    default:
    //do nothing
  }
}
function startInterval() {
  interval = setInterval(() => {
    _onChange(getFormattedDuration());
    if (duration <= 0) {
      stopTimer();
      _onEnd();
    } else {
      duration -= 1;
    }
  }, 1000);
}
function stopInterval() {
  clearInterval(interval);
}
function setDuration(secs: number) {
  duration = secs;
}
function getFormattedDuration() {
  return formatDuration(duration);
}

export {
  isTimerRunning,
  startTimer,
  pauseTimer,
  stopTimer,
  setDuration,
  getFormattedDuration,
  resumeTimer,
  toggleTimer,
};
