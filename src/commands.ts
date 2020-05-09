import { commands, workspace, window, StatusBarAlignment } from "vscode";
import {
  startTimer,
  isTimerRunning,
  pauseTimer,
  stopTimer as _stopTimer,
} from "./timer";
import { parseDurationStr } from "./utils";
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
let { duration = 30 } = workspace.getConfiguration("il55timer");
const requestDuration = async () => {
  const results = await window.showInputBox({
    placeHolder:
      "Enter duration. Add [h|m|s] to number to specify unit. Default is minutes",
  });
  return results ? parseDurationStr(results) : 0;
};
const updateStatusBar = (time: string) => {
  statusBarItem.text = time;
};
const stopTimer = () => {
  _stopTimer();
  updateStatusBar("00:00:00");
};
const restartTimer = () => {
  stopTimer();
  startTimer(duration, {
    onChange: updateStatusBar,
    onEnd: () => window.showInformationMessage("Session is done"),
  });
};
export function makeCommands() {
  const startCmd = commands.registerCommand(
    "il55-timer.startTimer",
    async () => {
      if (isTimerRunning()) {
        window.showErrorMessage("Timer is already running");
        return;
      }
      const newDuration = await requestDuration();
      newDuration && (duration = newDuration);
      restartTimer();
    }
  );
  const stopCmd = commands.registerCommand("il55-timer.stopTimer", () => {
    stopTimer();
  });
  const restartCmd = commands.registerCommand("il55-timer.restartTimer", () => {
    restartTimer();
  });
  const pauseCmd = commands.registerCommand("il55-timer.pauseTimer", () => {
    pauseTimer();
  });
  const hideCmd = commands.registerCommand("il55-timer.hideTimer", () => {
    statusBarItem.hide();
  });
  const showCmd = commands.registerCommand("il55-timer.showTimer", () => {
    statusBarItem.show();
  });
  statusBarItem.show();
  return [startCmd, hideCmd, showCmd, pauseCmd, stopCmd, restartCmd];
}
