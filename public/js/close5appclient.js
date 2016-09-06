function getItemsSorted(sortedBy, order) {
    $.ajax({
        url: "api/items?sortedby="+sortedBy  + "&order="+order
    }).then(function(data) {
       $('.getItemsSortedResult').text(JSON.stringify(data, null, "\t"));
    });
    
    return false;
}

function getItemById(id) {
	if(!id){
		alert("ID cannot be empty!");
		return false;
	}
	
    $.ajax({
        url: "api/items/id/"+id
    }).then(function(data) {
       $('.getItemByIdResult').text(JSON.stringify(data, null, "\t"));
    });
    
    return false;
}

function getItemsByUserId(userId){
	if(!userId){
		alert("User ID cannot be empty!");
		return false;
	}
	
    $.ajax({
        url: "api/items/userid/"+userId
    }).then(function(data) {
       $('.getItemsByUserIdResult').text(JSON.stringify(data, null, "\t"));
    });
    
    return false;
}


function getItemsWithinDistance(distance, lat, long){
    $.ajax({
        url: "api/items/geo?lat="+lat+"&long="+long+"&distance="+distance
    }).then(function(data) {
       $('.getItemsWithinDistanceResult').text(JSON.stringify(data, null, "\t"));
    });
    
    return false;
}