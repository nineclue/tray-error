const { app, tray, menu, webviewWindow, process } = window.__TAURI__;

app.getName().then((appName) => {
    console.log("hello, " + appName);
});

const tauriIcon = await app.defaultWindowIcon();
const targetLabel = "targetWebviewWindow";

function menuHandler(id) {
    console.log(id);
    var url;
    switch (id) {
        case "tauri":
            url = "https://tauri.app";
            break;
        case "scalajs":
            url = "https://scala-js.org";
            break;
        default:
            url = "https://google.com";
    }
    // window.location.replace(url);
    console.log('Loading... ' + url);
    webviewWindow.WebviewWindow.getByLabel(targetLabel).then(function(wvwOrNull) {
        if (wvwOrNull == null) {
            console.log("Target WebviewWindow doesn't exist.");
            createNewWebViewWindow(url);
        } else {
            console.log("Destroying existing target WebviewWindow");
            wvwOrNull.destroy().then(function () {
                createNewWebViewWindow(url);
            }, function(e) {
                console.log("destroy failed" + e);
            })
        }        
    });
}

function createNewWebViewWindow(url) {
    console.log("creating new Target WebviewWindow.");
    let wvw = new webviewWindow.WebviewWindow(targetLabel, { "url": url });
    wvw.once("tauri://webview-created", function () {
        console.log("Target WebviewWindow created... Now showing");
        wvw.show();
    }).then(function (unlistener) {
        console.log("unlistening");
        unlistener();
    });
}

const tauriMenu = await menu.Menu.new({
    items: [
        { id: "tauri", text: "Tauri", action: menuHandler },
        { id: "scalajs", text: "Scala.js", action: menuHandler },
        { id: "quit", text: "Quit", action: function() { process.exit(0); } }
    ],
});


function trayHandler(e) {
    console.log(e);
}

const options = {
    icon: tauriIcon,
    action: trayHandler,
    menu: tauriMenu,
};

const t = await tray.TrayIcon.new(options);

export { menuHandler };