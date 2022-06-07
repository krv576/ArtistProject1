//Genre functions
{
    function getGenres(callback) {
        execute('/api/genres/', 'GET', null, function (genresArray) {
            callback({ error: false, data: genresArray });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
}

//Track functions
{
    function addUpdateTrack(update, name, length, fileName, oldMelody, albumId, artistId, genreId, submitBtn) {
        submitBtn.innerHTML = `${update ? "Updating" : "Creating"} track, Please wait...`
        submitBtn.disabled = true;
        execute('/api/albums/' + (update ? update : ""), `${update ? "PUT" : "POST"}`, { name, length, fileName, oldMelody, albumId, artistId, genreId }, function (newTrack) {
            submitBtn.innerHTML = "Done";
            alert(name + ` successfully ${update ? "Updated" : "Created"}.`)
            history.back();
        }, function (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit"
            console.log("err", err);
            alert(`${err && err !== "Error" ? err : "Error occurred. Please try again"}`);
        });
    }

    let tracks = {};
    function loadTracks(containerId, albumId, albumName) {
        let listOL = document.getElementById(containerId);
        listOL.innerHTML = `<a>Loading ${albumName} tracks...</a>`;
        execute('/api/tracks/' + (albumId ? "album/" + albumId : ""), 'GET', null, function (tracksArray) {
            let innerHtmlSample = '<li onclick="onTrackSelected($trackId$)" style="cursor:pointer;"  class="w3-half"><dt>$TrackName$ ($TrackLength$)</dt><br>$NewLine$</li>';
            let oldMelodyDisplayStr = '<a style="color:maroon">*</a>';
            let innerHtml = "";
            tracks = {};
            for (let index = 0; index < tracksArray.length; index++) {
                let track = tracksArray[index];
                tracks[track.id] = track;
                let trackIndex = index;
                if ((trackIndex + 1) > 6) {
                    trackIndex = index % 6;
                }
                let newLine = "";
                /* if ((index + 1) % 2 == 0) {
                    newLine = "<br>";
                } */
                const element = innerHtmlSample.replace("$TrackName$", track.name)
                    .replace("$TrackLength$", track.length)
                    .replace("$trackId$", track.id)
                    .replace("$NewLine$", newLine);
                innerHtml += element;
                trackIndex++;
            }
            if (tracksArray.length == 0) {
                innerHtml = `No tracks are available`;
            }
            listOL.innerHTML = innerHtml;
        }, function (err) {
            listOL.innerHTML = `<a style="color:red">${err && err !== "Error" ? err : "Error occurred. Please try again"}</a>`;
        });
    }

    function onTrackSelected(trackId) {
        let track = tracks[trackId];
        location.href = '../Track/View.html?id=' + trackId;
    }
}

//Album functions
{
    function searchAlbums(queryStr, callback) {
        if (!queryStr) {
            return callback({ error: false, data: [] });
        }
        execute('/api/albums/' + queryStr, 'GET', null, function (albumssArray) {
            callback({ error: false, data: albumssArray });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function getAlbums(callback) {
        execute('/api/albums/', 'GET', null, function (albumssArray) {
            callback({ error: false, data: albumssArray });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function getAlbum(albumId, callback) {
        execute('/api/albums/' + albumId, 'GET', null, function (album) {
            callback({ error: false, data: album });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function deleteAlbum(albumId, callback) {
        execute('/api/albums/' + albumId, 'DELETE', null, function (res) {
            callback({ error: false, data: res });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function addUpdateAlbum(update, name, year, artistId, genreId, submitBtn) {
        submitBtn.innerHTML = `${update ? "Updating" : "Creating"} album, Please wait...`
        submitBtn.disabled = true;
        execute('/api/albums/' + (update ? update : ""), `${update ? "PUT" : "POST"}`, { name, year, artistId, genreId }, function (newAlbum) {
            submitBtn.innerHTML = "Done";
            alert(name + ` successfully ${update ? "Updated" : "Created"}.`)
            history.back();
        }, function (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit"
            console.log("err", err);
            alert(`${err && err !== "Error" ? err : "Error occurred. Please try again"}`);
        });
    }

    let albums = {};
    function loadAlbums(containerId, artistId, artistName) {
        let albumsListOL = document.getElementById(containerId);
        albumsListOL.innerHTML = `<a>Loading ${artistName} albums...</a>`;
        execute('/api/albums/' + (artistId ? "artist/" + artistId : ""), 'GET', null, function (albumsArray) {
            let innerHtmlSample = '<li onclick="onAlbumSelected($albumId$)" style="cursor:pointer;"  class="w3-half"><dt>$AlbumName$ ($AlbumYear$)</dt><br>$NewLine$</li>';
            let topArtistDisplayStr = '<a style="color:maroon">*</a>';
            let innerHtml = "";
            albums = {};
            for (let index = 0; index < albumsArray.length; index++) {
                let album = albumsArray[index];
                albums[album.id] = album;
                let albumIndex = index;
                if ((albumIndex + 1) > 6) {
                    albumIndex = index % 6;
                }
                let newLine = "";
                /* if ((index + 1) % 2 == 0) {
                    newLine = "<br>";
                } */
                const element = innerHtmlSample.replace("$AlbumName$", album.name)
                    .replace("$AlbumYear$", album.year)
                    .replace("$albumId$", album.id)
                    .replace("$NewLine$", newLine);
                innerHtml += element;
                albumIndex++;
            }
            if (albumsArray.length == 0) {
                innerHtml = `Albums not found`;
            }
            albumsListOL.innerHTML = innerHtml;
        }, function (err) {
            albumsListOL.innerHTML = `<a style="color:red">${err && err !== "Error" ? err : "Error occurred. Please try again"}</a>`;
        });
    }

    function onAlbumSelected(albumId) {
        let album = albums[albumId];
        /* console.log("albums", albumId, typeof albumId, albumId);
        alert(album.name + " selected"); */
        location.href = '../album/view.html?id=' + albumId;
    }
}

//Artist functions
{
    function searchArtists(queryStr, callback) {
        if (!queryStr) {
            return callback({ error: false, data: [] });
        }
        execute('/api/artists/' + queryStr, 'GET', null, function (artistsArray) {
            callback({ error: false, data: artistsArray });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function getArtists(callback) {
        execute('/api/artists/', 'GET', null, function (artistsArray) {
            callback({ error: false, data: artistsArray });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function getArtist(artistId, callback) {
        execute('/api/artists/' + artistId, 'GET', null, function (artist) {
            callback({ error: false, data: artist });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function deleteArtist(artistId, callback) {
        execute('/api/artists/' + artistId, 'DELETE', null, function (res) {
            callback({ error: false, data: res });
        }, function (err) {
            callback({ error: true, data: `${err && err !== "Error" ? err : "Error occurred. Please try again"}` });
        });
    }
    function addUpdateArtist(update, name, topArtist, submitBtn) {
        submitBtn.innerHTML = `${update ? "Updating" : "Creating"} artist, Please wait...`
        submitBtn.disabled = true;
        execute('/api/artists/' + (update ? update : ""), `${update ? "PUT" : "POST"}`, { name, top: topArtist ? topArtist : false }, function (newArtist) {
            submitBtn.innerHTML = "Done";
            alert(name + ` successfully ${update ? "Updated" : "Created"}.`)
            history.back();
        }, function (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit"
            console.log("err", err);
            alert(`${err && err !== "Error" ? err : "Error occurred. Please try again"}`);
        });
    }

    let artists = {};
    function loadArtists(containerId, onlyTopArtists) {
        let albumsListOL = document.getElementById(containerId);
        albumsListOL.innerHTML = `<a>Loading ${onlyTopArtists ? "top " : ""}artists...</a>`;
        execute('/api/artists/' + (onlyTopArtists ? "top/" : ""), 'GET', null, function (artistsArray) {
            let innerHtmlSample = '<li onclick="onArtistSelected($artistId$)" style="cursor:pointer;"  class="w3-half"><dt>$TopArtist$$ArtistName$</dt><br>$NewLine$</li>';
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
                /* if ((index + 1) % 2 == 0) {
                    newLine = "<br>";
                } */
                const element = innerHtmlSample.replace("$ArtistName$", artist.name)
                    .replace("$TopArtist$", artist.top ? topArtistDisplayStr : "")
                    .replace("$artistId$", artist.id)
                    .replace("$NewLine$", newLine);
                innerHtml += element;
                artistIndex++;
            }
            if (artistsArray.length == 0) {
                innerHtml = `No ${onlyTopArtists ? "top " : ""} artists found`;
            }
            albumsListOL.innerHTML = innerHtml;
        }, function (err) {
            albumsListOL.innerHTML = `<a style="color:red">${err && err !== "Error" ? err : "Error occurred. Please try again"}</a>`;
        });
    }

    function onArtistSelected(artistId) {
        let artist = artists[artistId];
        /* console.log("artists", artistId, typeof artistId, artists);
        alert(artist.name + " selected"); */
        location.href = './artist/View.html?id=' + artistId;
    }
}

//Common functions
{
    function getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var obj = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }

        return obj;
    }
    function execute(urlPath, requestMethod, requestBody, onSuccess, onError) {
        let url = "http://localhost:3000" + urlPath;
        requestAPI(url, requestMethod, requestBody, function (err, response) {
            if (err) {
                if (onError) {
                    try {
                        response = JSON.parse(response);
                        if (response && response.message) {
                            onError(response.message);
                        } else {
                            onError(err);
                        }
                    } catch (e2) {
                        console.log(e2);
                        onError(err);
                    }
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
}