# il55-timer README

Simpler timer to keep myself from spending too much time on a given task.

## Features

Enter a duration, start a timer, and begin working.

When timer finishes a message will appear to let me know that I have spent my alloted time.

<!-- For example if there is an image subfolder under your extension project workspace: -->

<!-- \!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

## Extension Settings

This extension contributes the following settings:

- `il55.duration`: Default duration used for a timer

## Commands

This extension contributes the following commands:

- `Start Timer`: Enter a duration and start a timer. Duration can be a number (assumed to be minutes) or a string formatted as `<number>h <number>m <number>s`
- `Stop Timer`: Stop running timer
- `Restart Timer`: Restart timer. Timer duration will be the same as a previous session or come from `duration` setting
- `Pause Timer`: Pause running timer
- `Show Timer`: Show timer status bar item
- `Hide Timer`: Hide timer status bar item

## Examples strings for setting duration

1. Start a 30 minute timer: "30" or "30m"
2. Start an hour long timer: "60" or "1h"
3. Start a 30 second timer: "30s"

## Known Issues

Report any issues found

<!-- ## Release Notes -->

### 1.0.0

Initial release of timer

---

<!-- ## Working with Markdown -->

<!-- **Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets -->

**Enjoy!**
