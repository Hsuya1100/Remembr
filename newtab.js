// "use strict";
var days=["Sun","Mon","Tues","Wed","Thu","Fri","Sat"];
var months=["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
var tags=[];
var tagdiv=document.getElementsByClassName("tagss")[0];
var SiteArea=document.getElementsByClassName("Sites")[0];
var btn_next = document.getElementById("btn_next");
var btn_prev = document.getElementById("btn_prev");
var listing_table =tagdiv;
var objJson=[];
var current_page = 1;
var records_per_page = 25;
// Displays Tags on screen
  displaytags();
function displaytags(){
	chrome.storage.sync.get("Tags",function(data){
    objJson=data["Tags"];  
    // console.log(objJson);
    changePage(1);     
    // console.log(numPages()); 
    pagination(objJson);
  });
}

function pagination(tags){
// objJson=tags;

// Previous Page
document.getElementById("btn_prev").addEventListener("click",function(prev){
  prevPage();
  });
  
  // Next Page
  document.getElementById("btn_next").addEventListener("click",function(next){
  nextPage();
  }); 
}


// Pagination Helping Functions
// --------------------------------------------------------------------

function prevPage()
{
  if (current_page > 1) {
      current_page--;
      changePage(current_page);
  }
}

function nextPage()
{
  if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
  }
}
  
function changePage(page)
{
  // Validate page
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  listing_table.innerHTML = "";

for (var i = (page-1) * records_per_page; i < Math.min( (page * records_per_page),objJson.length); i++) {
      listing_table.innerHTML +="<button id='button_tag'check='0' value="+objJson[i]+">  <div id='remove_tag'></div ><p id='tag_text' >"+objJson[i]+"</p<</button>";
  }

  if (page == 1) {
      btn_prev.style.visibility = "hidden";
  } else {
      btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
      btn_next.style.visibility = "hidden";
  }
   else {
      btn_next.style.visibility = "visible";
  }
}

function numPages()
{
  return Math.ceil(objJson.length / records_per_page);
}

//====================================================================

//___Displays sites corresponding to tag___   ANd OTHER STUff
var prev;
document.addEventListener('click',function(button){
  // console.log(button.target.getAttribute("id"));

  //---Clear Site---------------------------------
  // console.log(button.target);
  console.log(button.target.parentNode);
  if(button.target.getAttribute("id") === "remove_site"){
    // button.target.parentNode.setAttribute("visibility","hidden");
    button.target.parentNode.style.visibility="hidden";
    // console.log(button.target.innerHTML);
    // console.log(button.target.parentNode);
    ClearSite(button.target);
    
  }
  
  //---Clear Tag---------------------------------
  else if(button.target.getAttribute("id") === "remove_tag"){
    // console.log(button.target .parentNode);
    button.target.parentNode.style.visibility="hidden";
    // console.log(button.target.parentNode);
        ClearTag(button.target.parentNode.getAttribute("value"));
  }


  else if(button.target.getAttribute("check")=="0"){
      if(prev){
        prev.style.backgroundColor="rgb(128, 128, 128,0.4)";
        prev.setAttribute("check","0");
        ClearArea(SiteArea);
      }
      button.target.setAttribute("check","1");
      button.target.style.backgroundColor= "rgba(127, 133, 133, 0.822)"; 
      // button.target.style.backgroundColor= "rgb(128, 128, 128,0.8)"; 
      FillArea(button.target);
      prev=button.target; 
  }
  else if(button.target.getAttribute("check")=="1"){
    if(prev){
      prev.style.backgroundColor="rgb(128, 128, 128,0.4)";
      prev.setAttribute("check","0");
      ClearArea(SiteArea);
    }
    button.target.style.backgroundColor= "rgb(128, 128, 128,0.4)";
    button.target.setAttribute("check","0");
  }
});

//-------------------Fill_the_Site_Area---------------------------------
function FillArea(button){
  var dispSite="";
  chrome.storage.sync.get([button.value],function(data){
		data[button.value].forEach(function(site){
      var FormattedSite=site.substring(0,Math.min(43,site.length));
			dispSite=dispSite+"<li><a href="+site+" id='url' value="+site+" alt="+site+" tg="+button.value+" class='list_site' >"+FormattedSite+"</a><div class='remove_site' id='remove_site'"+" tg="+button.value+" site="+site+" ></div></li>";
		});	
		SiteArea.innerHTML=dispSite;
	});
	// console.log(dispSite);
};

// Clear DisplaySites
function ClearArea(SiteArea){
  SiteArea.innerHTML="";
};

// Clock
startTime();
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m); 
  s = checkTime(s);
  var tim = h + ":" + m;
  var dat=today.getDate()+" "+months[today.getMonth()];
  var day=days[ today.getUTCDay()];
  document.getElementById('time').innerHTML=tim ;
  document.getElementById('date').innerHTML=dat ;
  document.getElementById('day').innerHTML=day ;
  // console.log(today.getDate()+" "+days[ today.getUTCDay()]+" "+months[today.getMonth()]);
  var t = setTimeout(startTime, 6000);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

// Sweep Storage Area
function sweep(){
	chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
	});
}

// clear  Tag
function ClearTag(this_tag){
  // console.log(this_tag.getAttribute("value"));
  chrome.storage.sync.get("Tags",function(data){
    var Ta=data["Tags"];
    Ta=Ta.filter(e => e !== this_tag);
    console.log(Ta);
    chrome.storage.sync.set({"Tags":Ta});  
  });
}

// Clear Site in Tag
// ClearSite(document.getElementById('url')[0]);
// document.getElementById('sit').addEventListener('click',function(button){
//   console.log(document.getElementsByClassName('list_site')[2]);
//   // ClearSite(document.getElementById('url'));
// });

function ClearSite(this_site){
  var search_element=this_site.getAttribute("tg");
  var search_value=this_site.getAttribute("site");
  chrome.storage.sync.get([search_element],function(data){
    var sites=data[search_element];
    console.log((sites));
    sites=sites.filter(e => e !== search_value);
    console.log((sites));
    chrome.storage.sync.set({[search_element]:sites});  
    });  
  console.log(search_value);
}

// Clear Site
// console.log(document.getElementsByClassName("remove_site"));
// document.getElementsByClassName("remove_site").addEventListener("click",function(div){
//   console.log(div);
//   // ClearSite();
// });
