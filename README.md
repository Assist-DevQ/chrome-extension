# DevQ - chrome-extension
chrome-extension -  for recording testing scenarios

## Project Structure
- `src`: TypeScript source files
- `public`: Chrome Extension manifest, icon, HTMLs
- `dist`: This is where the Chrome Extension will be built
  - `dist/build`: Generated JavaScript bundles with source mapping, and assets

## Project config
Create a `.env` file in te root of the project.
Add the following lines to the `.env` file:

```sh
API_BASE_URL=http://788c9076.ngrok.io/extension/api/v1
API_AUTH=<base64 ecoded basic credentials>
```

## Development build
Runs webpack in watch mode, generates bundles with source mapping
```
npm start
```

## Production build
Runs webpack and generates the minified bundles
```
npm run build
```

## Load extension to chrome
- Build the extension
- Open Chrome and go to `chrome://extensions`
- Click `Load unpacked extension...`
- Load the `dist` directory

## Debugging your extension
- Click on the icon of your extension opens the **popup** window
- Right click and open DevTools
- In DevTools you can press Ctrl+R to reload
- Because source maps are generated, you can easily debug your ts code in DevTools

## Roadmap

- Store in the local storage the selected project and scenario so the pop-up remembers them if closed and reopened
- Send the selected scenario id with the stop event tot he back script so it can upload the events
