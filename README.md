# ClipMate

ClipMate is a universal clipboard manager written in ElectronJS. ClipMate monitors your clipboard and stores the history of your clipboard text, allowing you to easily go back in history in your clipboard.

## Building distributions

To build distributions for all support operating systems, first install `electron-builder`:

```bash
npm install --save-dev electron-builder
```

Then run `npm run dist`:

```bash
npm run dist
```

Native binaries for each OS will be output to the `dist` directory.