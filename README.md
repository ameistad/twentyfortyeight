# twentyfortyeight

2048 built with [Solid](https://www.solidjs.com/).

```
npm install
npm run dev      # start dev server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

Controls: arrow keys or swipe to move, Ctrl/Cmd+Z to undo.

Use **Export history** to download your game as a JSON file. **Import history**
loads that file, replacing the current game so you can continue playing and undo
previous moves. The file includes the board history (up to the latest 1,000 states)
and the move counter shown below the board. Imported games also save automatically
in your browser, just like games started here. Export your current game first if
you want to keep it before importing another one.

Run `npm test` to check save-file validation and history round trips.
