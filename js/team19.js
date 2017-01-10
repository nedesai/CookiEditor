

chrome.tabs.query({
    currentWindow: true,
    active: true
}, function(tabs) {
    chrome.webNavigation.getAllFrames({
        tabId: tabs[0].id
    }, function(details) {
        
        var urls = details.reduce(function(urls, frame) {
            if (urls.indexOf(frame.url) === -1)
                urls.push(frame.url);
            return urls;
        }, []);
        
        var index = 0;
        var cookies = [];
        urls.forEach(function(url) {
            chrome.cookies.getAll({
                url: url
            }, function(additionalCookies) {
                cookies = cookies.concat(additionalCookies);
                if (++index === urls.length) {

                	undupcookies = removeDuplicates(cookies);
                    chrome.tabs.getSelected(null, function (tab) {
  						var url = new URL(tab.url)
  						var domain = url.hostname
                  		sdomain = domain.split('.');
                  		console.log(sdomain)
						firstP =[];
						thirdP = [];
						for( var i = 0; i < undupcookies.length; ++i){
							var cd = undupcookies[i].domain.split('.')
							if(cd[cd.length-2] != sdomain[sdomain.length-2]) {
								thirdP.push(undupcookies[i]);
							}
							else{
								firstP.push(undupcookies[i])
							}
						}
						console.log(firstP)
						console.log(thirdP)
						makeTable(firstP, "firstPartyCookieTable");
                    	makeTable(thirdP, "thirdPartyCookieTable");
				
					});

                }
            }); 
        }); 
    }); 
}); 
var deleting = 0;

function l1()
{
	deleting = 1;
}

function l2()
{
	deleting = 0;
}

function makeTable(cookies, id){

	var numCookies = cookies.length;
	var table = document.getElementById(id);
	console.log(id)

	var newRow = table.insertRow(0);
	newRow.setAttribute("id", "0");
	newRow.insertCell(0).innerHTML= "Name".bold();
    newRow.insertCell(1).innerHTML= "Domain".bold();
    newRow.insertCell(2).innerHTML= "Secure".bold();
    newRow.insertCell(3).innerHTML= "Delete".bold();


	for(i = 1; i <= numCookies; ++i){
		var newRow = table.insertRow(i);
		newRow.setAttribute("id", i);
		newRow.insertCell(0).innerHTML= cookies[i-1].name;
	    newRow.insertCell(1).innerHTML= cookies[i-1].domain;
	    newRow.insertCell(2).innerHTML= cookies[i-1].secure;
	    newRow.insertCell(3).innerHTML= '<button value="Delete" id="button-'+i+'"><img src="trash.png" width="20"></button>';
	    newRow.cells[3].setAttribute("id", i);
	    newRow.cells[3].addEventListener('click', function(event){
	    	var temp = event.path[1].id;
		    var rowNum = temp.substr(temp.length-1);

		    if(id == 'firstPartyCookieTable')
		    {
		    	console.log(firstP[rowNum-1]);
		    	if (firstP[rowNum-1].httpOnly)
		    	{
		    		$('#myModalHttpOnly').modal('show');
		    	}
		    	else
		    	{
		    		$('#myModal').modal('show');
			    	document.getElementById("yes").addEventListener("click", l1);	
			    	//console.log(event.path[1].id)
			    	if (deleting == 1)
			    	{
					    
					    for(e = 1; e < table.rows.length; ++e) {

					    	console.log(table.rows[e].cells[3].id)

					    	if(table.rows[e].cells[3].id == rowNum){
					    		table.deleteRow(e);
					    		rowNum = e;
					    	}

					    }

					    if(id == 'firstPartyCookieTable'){
					    	if(firstP[rowNum-1]){
						    	var name = firstP[rowNum-1].name
						    	var url = 'http://' + firstP[rowNum-1].domain.replace('.','')
						  		firstP.splice(rowNum-1,1)
						    	console.log(url)
						    	console.log(name)
						    	chrome.cookies.remove({'url': url,'name': name});
						    }
					    }
					    else{
					    	if(thirdP[rowNum-1]){
						    	var name = thirdP[rowNum-1].name
						    	var url = 'http://' + thirdP[rowNum-1].domain.replace('.','')
						  		thirdP.splice(rowNum-1,1)
						    	console.log(url)
						    	console.log(name)
						    	chrome.cookies.remove({'url': url,'name': name});
						    }
					    }
					    deleting = 0;
					}
		    	}
		    }
		    else
		    {
		    	console.log(thirdP[rowNum-1]);
		    	if (thirdP[rowNum-1].httpOnly)
		    	{
		    		$('#myModalHttpOnly').modal('show');
		    	}
		    	else
		    	{
		    		$('#myModal').modal('show');
			    	document.getElementById("yes").addEventListener("click", l1);	
			    	//console.log(event.path[1].id)
			    	if (deleting == 1)
			    	{
					    
					    for(e = 1; e < table.rows.length; ++e) {

					    	console.log(table.rows[e].cells[3].id)

					    	if(table.rows[e].cells[3].id == rowNum){
					    		table.deleteRow(e);
					    		rowNum = e;
					    	}

					    }

					    if(id == 'firstPartyCookieTable'){
					    	if(firstP[rowNum-1]){
						    	var name = firstP[rowNum-1].name
						    	var url = 'http://' + firstP[rowNum-1].domain.replace('.','')
						  		firstP.splice(rowNum-1,1)
						    	console.log(url)
						    	console.log(name)
						    	chrome.cookies.remove({'url': url,'name': name});
						    }
					    }
					    else{
					    	if(thirdP[rowNum-1]){
						    	var name = thirdP[rowNum-1].name
						    	var url = 'http://' + thirdP[rowNum-1].domain.replace('.','')
						  		thirdP.splice(rowNum-1,1)
						    	console.log(url)
						    	console.log(name)
						    	chrome.cookies.remove({'url': url,'name': name});
						    }
					    }
					    deleting = 0;
					}
		    	}
		    }
	    });

	}

}




function removeDuplicates(cookies) {
	var check = {};
	var returnArr = []
	var length = cookies.length;
	for(i = 0; i < length; ++i){
		if(cookies[i].value in check){
			continue;
		}
		else {
			check[cookies[i].value] = cookies[i];
		}
	}
	for(item in check) {
		returnArr.push(check[item])
	}
	return returnArr;
}