window.addEventListener("load", function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("ServiceWorker.js");
    }
});

  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/Build.loader.js";
  var config = {
    dataUrl: buildUrl + "/Build.data.unityweb",
    frameworkUrl: buildUrl + "/Build.framework.js.unityweb",
    codeUrl: buildUrl + "/Build.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "devten",
    productName: "allstar",
    productVersion: "1",
    showBanner: unityShowBanner,
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
      document.getElementsByTagName('head')[0].appendChild(meta);

      screen.orientation.lock("portrait").then(() => { }).catch((error) => { alert("phone screen lock error : " + error) });
      //canvas.orientation.lock("portrait").then(() => { }).catch((error) => { alert("phone canvas lock error : " + error) });
      //window.orientation.lock("portrait").then(() => { }).catch((error) => { alert("phone window lock error : " + error) });
      //container.orientation.lock("portrait").then(() => { }).catch((error) => { alert("phone container lock error : " + error) });
      //config.matchWebGLToCanvasSize = false;
  }

  canvas.style.background = "url('" + buildUrl + "/Build.jpg') center / cover";
  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance) => {
          unityInstanceRef = unityInstance;
          loadingBar.style.display = "none";

          //container.requestFullscreen().catch((error) => { alert("requestFullscreen error : " + error); });

        //screen.orientation.lock("portrait").then(() => { }).catch((error) => { alert("onload screen lock error : " + error) });
        //canvas.orientation.lock("portrait").then(() => { }).catch((error) => { alert("onload canvas lock error : " + error) });
        //window.orientation.lock("portrait").then(() => { }).catch((error) => { alert("onload window lock error : " + error) });
        //container.orientation.lock("portrait").then(() => { }).catch((error) => { alert("onload container lock error : " + error) });
    }).catch((message) => {
      alert(message);
    });
  };
  document.body.appendChild(script);
