const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const isDev = require('electron-is-dev');
const { get } = require('axios');
const Store = require('./store');

const store = new Store({
  configName: 'settings',
  defaults: {
    user: { email: '', token: '', refresh: '' },
  },
});

/**
 * @description - Shuts down Electron & Flask.
 * @param {number} port - Port that Flask server is running on.
 */
const shutdown = (port) => {
  get(`http://localhost:${port}/quit`)
    .then(app.quit)
    .catch(app.quit);
};

/**
 * @namespace BrowserWindow
 * @description - Electron browser windows.
 * @tutorial - https://www.electronjs.org/docs/api/browser-window
 */
const browserWindows = {};

/**
 * @description - Creates main window.
 * @param {number} port - Port that Flask server is running on.
 * @memberof BrowserWindow
 */
const createMainWindow = (port) => {
  const { loadingWindow, mainWindow } = browserWindows;

  /**
     * @description - Function to use custom JavaSCript in the DOM.
     * @param {string} command - JavaScript to execute in DOM.
     * @param {function} callback - Callback to execute here once complete.
     * @returns {Promise}
     */
  const executeOnWindow = (command, callback) => mainWindow.webContents.executeJavaScript(command)
    .then(callback)
    .catch(console.error);

  /**
     * If in developer mode, show a loading window while
     * the app and developer server compile.
     */
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.hide();

    /**
         * Opening devTools, must be done before dom-ready
         * to avoid occasional error from the webContents
         * object being destroyed.
         */
    mainWindow.webContents.openDevTools({ mode: 'undocked' });

    /**
         * Hide loading window and show main window
         * once the main window is ready.
         */
    mainWindow.webContents.on('did-finish-load', () => {
      /**
             * Checks page for errors that may have occurred
             * during the hot-loading process.
             */
      const isPageLoaded = `
        var isBodyFull = document.body.innerHTML !== "";
        var isHeadFull = document.head.innerHTML !== "";
        var isLoadSuccess = isBodyFull && isHeadFull;

        isLoadSuccess || Boolean(location.reload());
      `;

      /**
             * @description Updates windows if page is loaded
             * @param {*} isLoaded
             */
      const handleLoad = (isLoaded) => {
        if (isLoaded) {
          /**
                     * Keep show() & hide() in this order to prevent
                     * unresponsive behavior during page load.
                     */
          mainWindow.show();
          loadingWindow.hide();
        }
      };

      /**
             * Checks if the page has been populated with
             * React project. if so, shows the main page.
             */
      executeOnWindow(isPageLoaded, handleLoad);
    });
  }

  /**
     * If using in production, the built version of the
     * React project will be used instead of localhost.
     */
  else mainWindow.loadFile(path.join(__dirname, 'build/index.html'));

  /**
     * @description - Controls the opacity of title bar on focus/blur.
     * @param {number} value - Opacity to set for title bar.
     */
  const setTitleOpacity = (value) => `
    if(document.readyState === 'complete') {
      const titleBar = document.getElementById('electron-window-title-text');
      const titleButtons = document.getElementById('electron-window-title-buttons');

      if(titleBar) titleBar.style.opacity = ${value};
      if(titleButtons) titleButtons.style.opacity = ${value};
    }
  `;

  mainWindow.on('focus', () => executeOnWindow(setTitleOpacity(1)));
  mainWindow.on('blur', () => executeOnWindow(setTitleOpacity(0.5)));

  /**
     * Listen and respond to ipcRenderer events on the frontend.
     * @see `src\utils\services.js`
     */
  ipcMain.on('app-maximize', (_event, _arg) => mainWindow.maximize());
  ipcMain.on('app-minimize', (_event, _arg) => mainWindow.minimize());
  ipcMain.on('app-quit', (_event, _arg) => shutdown(port));
  ipcMain.on('app-unmaximize', (_event, _arg) => mainWindow.unmaximize());
  ipcMain.on('get-port-number', (event, _arg) => {
    event.returnValue = port;
  });
  ipcMain.on('get-user-settings', (event, _arg) => {
    const { name, token, refresh } = store.get('user');
    event.returnValue = { user: { name, token, refresh } };
  });
  ipcMain.on('set-user-settings', (event, _arg) => {
    store.set('user', _arg);
    event.returnValue = true;
  });
};

/**
 * @description - Creates loading window to show while build is created.
 * @memberof BrowserWindow
 */
const createLoadingWindow = () => new Promise((resolve, reject) => {
  const { loadingWindow } = browserWindows;

  // Variants of developer loading screen
  const loaderConfig = {
    react: 'utilities/loaders/react/index.html',
    redux: 'utilities/loaders/redux/index.html',
  };

  try {
    loadingWindow.loadFile(path.join(__dirname, loaderConfig.redux));

    loadingWindow.webContents.on('did-finish-load', () => {
      loadingWindow.show();
      resolve();
    });
  } catch (error) {
    console.error(error);
    reject();
  }
});

/**
 * @description - Installs developer extensions.
 * @returns {Promise}
 */
const installExtensions = async (installer) => {
  const isForceDownload = Boolean(process.env.UPGRADE_EXTENSIONS);
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS', 'DEVTRON']
    .map((extension) => installer.default(installer[extension], isForceDownload));

  return Promise
    .allSettled(extensions)
    .catch(console.error);
};

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(async () => {
  /**
     * Method to set port in range of 3001-3999,
     * based on availability.
     */
  const port = 3000;

  /**
     * Assigns the main browser window on the
     * browserWindows object.
     */
  browserWindows.mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
  });

  /**
     * If not using in production, use the loading window
     * and run Flask in shell.
     */
  if (isDev) {
    const installer = require('electron-devtools-installer');
    await installExtensions(installer); // React, Redux, & Devtron devTools
    browserWindows.loadingWindow = new BrowserWindow({ frame: false });
    createLoadingWindow().then(() => createMainWindow(port));
    // spawn(`python app.py ${port}`, {detached: true, shell: true, stdio: 'inherit'});
  }

  /**
     * If using in production, use the main window
     * and run bundled app (dmg, elf, or exe) file.
     */
  else {
    createMainWindow(port);

    // Dynamic script assignment for starting Flask in production
    const runFlask = {
      darwin: `open -gj "${path.join(app.getAppPath(), 'resources', 'app.app')}" --args`,
      linux: './resources/app/app',
      win32: 'start ./resources/app/app.exe',
    }[process.platform];

    // spawn(`${runFlask} ${port}`, { detached: false, shell: true, stdio: 'pipe' });
  }

  app.on('activate', () => {
    /**
         * On macOS it's common to re-create a window in the app when the
         * dock icon is clicked and there are no other windows open.
         */
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow(port);
  });

  /**
     * Ensures that only a single instance of the app
     * can run, this correlates with the "name" property
     * used in `package.json`.
     */
  const initialInstance = app.requestSingleInstanceLock();
  if (!initialInstance) app.quit();
  else {
    app.on('second-instance', () => {
      if (browserWindows.mainWindow?.isMinimized()) browserWindows.mainWindow?.restore();
      browserWindows.mainWindow?.focus();
    });
  }

  /**
     * Quit when all windows are closed, except on macOS. There, it's common
     * for applications and their menu bar to stay active until the user quits
     * explicitly with Cmd + Q.
     */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      shutdown(port);
    }
  });
});
