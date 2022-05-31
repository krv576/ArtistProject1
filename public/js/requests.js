let artists = {};
function loadArtists(containerId) {
    let albumsListOL = document.getElementById(containerId);
    albumsListOL.innerHTML = "<a>Loading artists...</a>";
    execute('/api/artists/', 'GET', null, function (artistsArray) {
        let innerHtmlSample = '<li onclick="onArtistSelected($artistId$)"  class="w3-half"><dt>$TopArtist$$ArtistName$</dt><br>$NewLine$</li>';
        let topArtistDisplayStr = '<a style="color:maroon">*</a>';
        let innerHtml = "";
        artists = {};
        for (let index = 0; index < artistsArray.length; index++) {
            let artist = artistsArray[index];
            artists[artist.id] = artist;
            let artistIndex = index;
            if ((artistIndex + 1) > 6) {
                artistIndex = index % 6;
            }
            let newLine = "";
            if ((index + 1) % 4 == 0) {
                newLine = "<br>";
            }
            const element = innerHtmlSample.replace("$ArtistName$", artist.name)
                .replace("$TopArtist$", artist.top ? topArtistDisplayStr : "")
                .replace("$artistId$", artist.id)
                .replace("$NewLine$", newLine);
            innerHtml += element;
            artistIndex++;
        }
        albumsListOL.innerHTML = innerHtml;
    }, function (err) {
        albumsListOL.innerHTML = `<a style="color:red">${err && err !== "Error" ? err : "Error occurred. Please try again"}</a>`;
    });
}

function onArtistSelected(artistId) {
    let artist = artists[artistId];
    console.log("artists", artistId, typeof artistId, artists);
    alert(artist.name + " selected");
}

function execute(urlPath, requestMethod, requestBody, onSuccess, onError) {
    let url = "http://localhost:3000" + urlPath;
    requestAPI(url, requestMethod, requestBody, function (err, response) {
        if (err) {
            if (onError) {
                onError(err);
            } else {
                if (response) {
                    console.log("error res", JSON.stringify(response));
                    alert("Error " + JSON.stringify(response));
                } else {
                    console.log("error res", err);
                    alert(err);
                }
            }
        } else {
            response = JSON.parse(response);
            console.log("success res", response);
            if (onSuccess) {
                onSuccess(response);
            }
        }
    });

}

function requestAPI(url, requestMethod, requestBody, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(requestMethod, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        let err = false;
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status <= 299) {
                var response = xhr.responseText;
                //Success
                callback(err, response);
            } else {
                var response = xhr.responseText;
                //Network/Server failure
                err = "Error";
                if (response) {
                    if (response.message) {
                        err = response.message;
                    }
                    callback(err, response);
                } else {
                    callback(err);
                }
            }
        }
    };
    if (requestBody) {
        xhr.send(JSON.stringify(requestBody));
    } else {
        xhr.send();
    }
}