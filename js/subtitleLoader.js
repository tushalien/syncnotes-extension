 var srt_text="";
 var i=0;

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

function removeBrackets(input) {
    return input
        .replace(/{+.*?}+/g, "")

        .replace(/\[\[|\]\]/g, "")
        .replace(/<.*?>/g, "");
}


function initExternalSubtitlesSupport() {
	var srt_text="";
	if (typeof $("#eow-title").html() == 'undefined' && i<5)
	{
		sleepFor(2000);
		i=i+1;
	}

  var tag = $("#eow-title").html().trim().replace(/ *\([^)]*\) */g, "").replace("&amp;","&").split(' [')[0];
   // tag = tag.replace("ft.", "");
    tag=tag.split('ft.')[0].trim(); 
        tag=tag.split('featuring')[0].trim(); 



  //tag = tag.replace("featuring", "");

var index = tag.indexOf("-");  // Gets the first index where a space occours
var artist = tag.substr(0, index).replace(/ *\([^)]*\) */g, "").replace("&amp;","&").split('[')[0].trim(); // Gets the first part
var song = tag.substr(index + 1).replace(/ *\([^)]*\) */g, "").replace("&amp;","&").split('[')[0].trim();


tag = song +" "+artist;

  //console.log("Tag: " + tag);
  tag = removeBrackets(tag);
  tag = tag.replace("ft.", "");
 // console.log(tag);
    var xhr = new XMLHttpRequest();
      xhr.open("GET","https://srt-api.herokuapp.com/api?song="+tag,false);
      xhr.send();
      srt_text=xhr.responseText;
      cond=srt_text;
      if (srt_text.length<50){
        srt_text="Can't find the subtitle.";

      }


      console.log(srt_text);
      loadSubtitles(srt_text, true, "UTF-8");
}
