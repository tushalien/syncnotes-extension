var subBubblesVideo;
var cond;
var areSubtitlesShowing = true;
var subtitlesSync = 0.0;
var subInfoDisplayTimer;
var subtitlesSize = "20";
var shortcutsMessage =  "<br><b>Keyboard Shortcuts<b><br>" +
                        "E : Enable/Disable <br>" +
                        "G : -50ms delay &emsp;&emsp;" +
                        "H : +50ms delay  <br>" +
                        "S : decrease font size  &emsp;&emsp;" +
                        "B : increase font size";

function fadeOutSubtitlesInfo() {
  if (subInfoDisplayTimer) {
    clearTimeout(subInfoDisplayTimer);
  }
  subInfoDisplayTimer = setTimeout(function() {
    $("#sub-info").fadeOut(3000);
  }, 1000);
}

/* Takes input as the url of the subtitle file and
 * loads subtitle on youtube video
 * add second argument to decide if it's from local file */
function loadSubtitles(subtitlesURL, isLocalFile, encoding) {
  /* Hide any previously uploaded subtitles */
  $('.subtitles').css("display", "block");

  /* Initialize new bubbles instance */
  if (!subBubblesVideo) {
    subBubblesVideo = new Bubbles.video('sub-video');
    registerKeyboardListeners();
  }
  var data = {
    "English": {
      language: "English",
      file: subtitlesURL,
      encoding: encoding,
      isLocalFile: isLocalFile
    }
  };

  subBubblesVideo.subtitles(false, data);

  $('#sub-info').css("opacity", 1);
  console.log(srt_text)
  if (cond.length<50)
  {
$("#sub-message").html("Oops, We were unable to find the subtitle file. r However , yo can refresh the page to try again.");
  }
  else{
  $("#sub-message").html("Subtitle added. Enjoy!!! <br> Hit space bar or click on subtitle to pause/resume the video."+ shortcutsMessage);
}
 // $("#sub-message").fadeOut(3000);

    getFontSizeFromLocalStorage();
}

function registerKeyboardListeners() {
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 'e'.charCodeAt() || e.keyCode == 'E'.charCodeAt()) {
      if (areSubtitlesShowing) {
       // console.log("Switching off subtitles");
        subBubblesVideo.subsShow(false);
        areSubtitlesShowing = false;
        $("#sub-info").html("Subtitles disabled").fadeIn();
        fadeOutSubtitlesInfo();
      } else {
        subBubblesVideo.subsShow(true);
        areSubtitlesShowing = true;
      //  console.log("Switching on subtitles");
        $("#sub-info").html("Subtitles enabled").fadeIn();
        fadeOutSubtitlesInfo();
      }
    }
    if (e.keyCode == 'g'.charCodeAt() || e.keyCode == 'G'.charCodeAt()) {
      subtitlesSync -= 0.050; //precede by 50ms
      subBubblesVideo.subsSync(subtitlesSync);
     // console.log("Delaying subs by -0.050ms");
      $("#sub-info").html("delay: " + Math.round(subtitlesSync * 1000) + "ms").fadeIn();
      fadeOutSubtitlesInfo();
    }
    if (e.keyCode == 'h'.charCodeAt() || e.keyCode == 'H'.charCodeAt()) {
      subtitlesSync += 0.050; //delay by 50ms
      subBubblesVideo.subsSync(subtitlesSync);
     // console.log("Delaying subs by +0.050ms");
      $("#sub-info").html("delay: " + Math.round(subtitlesSync * 1000) + "ms").fadeIn();
      fadeOutSubtitlesInfo();
    }
    if (e.keyCode == 's'.charCodeAt() || e.keyCode == 'S'.charCodeAt()) {
      subtitlesSize -= 1;
      if (subtitlesSize < 0) {
        subtitlesSize = 0;
      }
      if (subtitlesSize > 40) {
        subtitlesSize = 40;
      }
      $(".subtitles").css("font-size", subtitlesSize+"px");
      //storeFontSizeInLocalStorage(subtitlesSize);
      $("#sub-info").html("size: " + subtitlesSize).fadeIn();
      fadeOutSubtitlesInfo();
    }
    if (e.keyCode == 'b'.charCodeAt() || e.keyCode == 'B'.charCodeAt()) {
      subtitlesSize += 1;
      if (subtitlesSize < 0) {
        subtitlesSize = 0;
      }
      if (subtitlesSize > 40) {
        subtitlesSize = 40;
      }
      $(".subtitles").css("font-size", subtitlesSize+"px");
      //storeFontSizeInLocalStorage(subtitlesSize);
      $("#sub-info").html("size: " + subtitlesSize).fadeIn();
      fadeOutSubtitlesInfo();
    }
  }, false);
}

/* Function used to initliaze extension */
function initExtension() {

  /*sub-message is used to show status about upload status of subtitle file
  It appears just below the youtube video */
  $("#watch7-content").prepend("<div id='subitle-container-first' class='yt-card yt-card-has-padding'><span id='sub-message'></span></div>");

  if ($("video").length === 0) {

  } else {

    $("#sub-message").html("Loading the subtitle. Hold on..");
    $('video').attr('id', 'sub-video');
    $("#sub-video").after("<span id='sub-info'></span>");
    $('#subitle-container-first').after('<input id="fileupload" type="file" name="uploadFile" style="display:none"/>');
    $('#fileupload').after("<div id='sub-open-subtitles' style='display:none' class='yt-card yt-card-has-padding'><div>");

    //registerFileUploader();
    $("#sub-open-subtitles").load(chrome.extension.getURL("open-subtitles.html"), initExternalSubtitlesSupport);
  }
}

var pageHref;
var initExtensionInProcess = false;
setInterval(function() {
  if (window.location.href.indexOf("watch") > -1) {
    if (!pageHref || pageHref != window.location.href) {
      //  console.log("Found video page. Starting extension");
        pageHref = window.location.href;
        if (!initExtensionInProcess) {
          initExtensionInProcess = true;
          setTimeout(function(){
            $('.subtitles').css("display", "none");
            initExtension();
            initExtensionInProcess = false;
          }, 3000);
        }
    }
  }
}, 3000);

// function storeFontSizeInLocalStorage(fontSize) {
//   chrome.storage.local.set({
//       "subfontsize": fontSize
//   }, function() {
//    // console.log("Stored font size: " + fontSize + " in chrome storage");
//   });
// }

// function getFontSizeFromLocalStorage() {
//   chrome.storage.local.get(null, function(result) {
//    // console.log("Found font size in local storage:" + result["subfontsize"]);
//     if (result["subfontsize"]) {
//       subtitlesSize = result["subfontsize"];
//       $(".subtitles").css("font-size", subtitlesSize+"px");
//     }
//   });
// }