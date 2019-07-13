"use strict" 
// Fetching Default URL
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var url=tabs[0].url;
    // var title=tabs[0].title;
    document.getElementById("url").value=url;
    // document.getElementById("title").value=title;
});
var save=document.getElementById("save");
var clear=document.getElementById("clear");

// Save the InFormation
save.addEventListener('click',function(){
    var url=document.getElementById("url").value;
    var tag=document.getElementById("tag").value;
    // var tag=document.getElementById("tag").value.toLowerCase();
    // var title=document.getElementById("title").value;
    
        // Storing Tags
        chrome.storage.sync.get('Tags',function(data){
        var TagArray=data["Tags"];	
        console.log(data["Tags"]);
        if (typeof(TagArray) == 'undefined'){
            var TagArray2=[];
            TagArray2.push(tag);
            chrome.storage.sync.set({"Tags":TagArray2}); 
        }
        else{
            TagArray.sort();
             if(binarySearch(TagArray, tag)==-1){
                TagArray.push(tag);
                chrome.storage.sync.set({"Tags":TagArray});
            }
        }
    });

    // Storing Sites-Tags
    chrome.storage.sync.get([tag],function(data){
        var dataArr=[];
        dataArr=data[tag];
        if (typeof(dataArr) == 'undefined') {
            var dataArr2=[];
            dataArr2.push(url);
            chrome.storage.sync.set({[tag]:dataArr2}); 
        }
        else{
            dataArr.sort();
            console.log(binarySearch(dataArr, url));
            if(binarySearch(dataArr, url)==-1){
                dataArr.push(url);
                chrome.storage.sync.set({[tag]:dataArr});
            }
            // chrome.storage.sync.get([tag],function(data){
            //     console.log(data);
                                    // else{
                                    //     dataArr.push(url);
                                    //     chrome.storage.sync.set({[tag]:dataArr});
                                    // }
        };
    });

});

// Clear Field
clear.addEventListener('click',function(){
    document.getElementById("url").value="";
    document.getElementById("tag").value="";
       });
// });

// binary search for Tags
function binarySearch(items, value){
    var startIndex=0,
    stopIndex=items.length - 1,
    middle=Math.floor((stopIndex + startIndex)/2);
    while(items[middle] != value && startIndex < stopIndex){
        //adjust search area
        if (value < items[middle]){
            stopIndex=middle - 1;
        } else if (value > items[middle]){
            startIndex=middle + 1;
        }
        //recalculate middle
        middle=Math.floor((stopIndex + startIndex)/2);
    }
    //make sure it's the right value
    return(items[middle] != value) ? -1 : middle;
}