import { commands, workspace, window, StatusBarAlignment } from "vscode";
import {
  startTimer,
  isTimerRunning,
  pauseTimer,
  stopTimer as _stopTimer,
  toggleTimer,
  resumeTimer,
  isTimerPaused,
} from "./timer";
import { parseDurationStr } from "./utils";
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
let { duration = 1800 } = workspace.getConfiguration("il55timer");
const requestDuration = async () => {
  const results = await window.showInputBox({
    placeHolder:
      "Enter duration. Add [h|m|s] to number to specify unit. Default is minutes",
  });
  return results ? parseDurationStr(results) : 0;
};
const updateStatusBar = (time: string) => {
  let icon: string;
  if (isTimerRunning()) {
    icon = "debug-start";
  } else if (isTimerPaused()) {
    icon = "debug-pause";
  } else {
    icon = "debug-stop";
  }
  statusBarItem.text = `$(${icon}) ${time}`;
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
  const toggleCmd = commands.registerCommand("il55-timer.toggleTimer", () => {
    toggleTimer();
  });
  const resumeCmd = commands.registerCommand("il55-timer.resumeTimer", () => {
    resumeTimer();
  });
  statusBarItem.command = "il55-timer.toggleTimer";
  statusBarItem.show();
  updateStatusBar("00:00:00");
  return [
    startCmd,
    hideCmd,
    showCmd,
    pauseCmd,
    stopCmd,
    restartCmd,
    toggleCmd,
    resumeCmd,
  ];
}
