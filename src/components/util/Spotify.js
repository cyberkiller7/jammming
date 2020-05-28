/* eslint-disable no-unused-vars */
const clientId = 'e20df958b4f646dcac18490fc4a89488';
const redirectURI = 'http://localhost:3000/'
let userAccessToken;

var spotify = {
    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        }

        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expireIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expireIn) {
            userAccessToken = accessToken[1];
            const expiresIn = Number(expireIn[1]);
            window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessUrl;
        }
    },

    search(searchTerm) {
        const accessToken = spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                Id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlayList(name, trackUriArray){
        if(!name || !trackUriArray){
            return;
        }
        const accessToken = spotify.getAccessToken();
        const header = {
            Authorization: `Bearer ${accessToken}`
        }
        let userId;
        return fetch('https://api.spotify.com/v1/me', {headers:header}).then(response=>{
            return response.json()
        }).then(jsonResponse => {
            userId = jsonResponse.id; 
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
              {
                headers: header, 
                method: 'POST',
                body: JSON.stringify({name:name})
            }).then(response=> response.json()).then(jsonResponse=>{
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUriArray})
                }) 
                })
            })
            
        
    }
}


export default spotify;