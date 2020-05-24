import {
  commands,
  workspace,
  window,
  StatusBarAlignment,
  StatusBarItem,
} from "vscode";
import Timer, { State as TimerState } from "./timer";
import { parseDurationStr } from "./utils";
const requestDuration = async () => {
  const results = await window.showInputBox({
    placeHolder:
      "Enter duration. Add [h|m|s] to number to specify unit. Default is minutes",
  });
  return results
    ? parseDurationStr(results)
    : workspace.getConfiguration("il55timer").duration;
};
export class TimerStatusBarItem {
  private statusBarItem: StatusBarItem;
  constructor({
    initialText = "00:00:00",
    command,
  }: {
    initialText?: string;
    command?: string;
  }) {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    this.statusBarItem.text = initialText;
    this.statusBarItem.command = command;
    this.statusBarItem.show();
  }
  show() {
    this.statusBarItem.show();
  }
  hide() {
    this.statusBarItem.hide();
  }
  update(state: TimerState, timeLeft: string) {
    let icon;
    switch (state) {
      case TimerState.Running:
        icon = "debug-start";
        break;
      case TimerState.Paused:
        icon = "debug-pause";
        break;
      default:
        icon = "debug-stop";
    }
    this.statusBarItem.text = `$(${icon}) ${timeLeft}`;
  }
}
export function makeCommands() {
  const statusBarItem = new TimerStatusBarItem({
    command: "il55-timer.toggleTimer",
  });
  const timer = new Timer({
    onChange: (timeLeft: string) => {
      statusBarItem.update(timer.state, timeLeft);
    },
    onEnd: () => window.showInformationMessage("Session is done"),
  });

  const startCmd = commands.registerCommand(
    "il55-timer.startTimer",
    async () => {
      if (timer.isRunning) {
        window.showErrorMessage("Timer is already running");
        return;
      }
      const duration = await requestDuration();
      timer.start(duration);
    }
  );
  const stopCmd = commands.registerCommand("il55-timer.stopTimer", () => {
    timer.stop();
  });
  const restartCmd = commands.registerCommand("il55-timer.restartTimer", () => {
    timer.restart();
  });
  const pauseCmd = commands.registerCommand("il55-timer.pauseTimer", () => {
    timer.pause();
  });
  const hideCmd = commands.registerCommand("il55-timer.hideTimer", () => {
    statusBarItem.hide();
  });
  const showCmd = commands.registerCommand("il55-timer.showTimer", () => {
    statusBarItem.show();
  });
  const toggleCmd = commands.registerCommand("il55-timer.toggleTimer", () => {
    if (!timer.isActive) {
      timer.restart();
    } else {
      timer.toggle();
    }
  });
  const resumeCmd = commands.registerCommand("il55-timer.resumeTimer", () => {
    timer.resume();
  });
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
