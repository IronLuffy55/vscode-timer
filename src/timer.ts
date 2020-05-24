import { formatDuration } from "./utils";
//#region type defs
interface EventHandlers {
  onChange: (time: string) => void;
  onEnd: () => void;
}
export enum State {
  Running,
  Stopped,
  Paused,
  Idle,
}
//#endregion
//#region timer loop
let loopId: NodeJS.Timeout;
function startLoop(callback: () => void) {
  callback();
  loopId = setInterval(() => {
    callback();
  }, 1000);
}
function stopLoop() {
  clearInterval(loopId);
}
//#endregion
export default class Timer {
  private duration: number = 1800;
  private secondsLeft: number = 0;
  private _state: State = State.Idle;
  private eventHandlers: EventHandlers;
  constructor(eventHandlers: EventHandlers) {
    this.eventHandlers = eventHandlers;
  }
  start(duration: number) {
    if (this.isRunning) {
      throw new Error("Timer is already running");
    }
    this.duration = duration;
    this.secondsLeft = duration;
    this.runLoop();
  }
  stop() {
    if (!this.isActive) {
      return;
    }
    stopLoop();
    this.secondsLeft = 0;
    this.setState(State.Stopped);
  }
  pause() {
    if (!this.isRunning) {
      return;
    }
    stopLoop();
    this.setState(State.Paused);
  }
  resume() {
    if (!this.isPaused) {
      return;
    }
    this.runLoop();
  }
  toggle() {
    if (!this.isActive) {
      return;
    }
    return this.isRunning ? this.pause() : this.resume();
  }
  restart(duration?: number) {
    this.stop();
    this.start(duration || this.duration);
  }
  private setState(state: State) {
    if (this.state === state) {
      return;
    }
    this._state = state;
    this.onChange();
  }
  //#region loop methods
  private runLoop() {
    if (this.isRunning) {
      return;
    }
    this.setState(State.Running);
    startLoop(() => {
      this.onChange();
      if (this.secondsLeft <= 0) {
        this.stop();
        this.onEnd();
      } else {
        this.secondsLeft -= 1;
      }
    });
  }
  //#endregion
  //#region event handlers
  private onChange() {
    this.eventHandlers.onChange(formatDuration(this.secondsLeft));
  }
  private onEnd() {
    this.eventHandlers.onEnd();
  }
  //#endregion
  get state(): State {
    return this._state;
  }
  get isPaused(): Boolean {
    return this._state === State.Paused;
  }
  get isRunning(): Boolean {
    return this._state === State.Running;
  }
  get isActive(): Boolean {
    return this.isRunning || this.isPaused;
  }
}
