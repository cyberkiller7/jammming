import React from 'react';
import './App.css';
import { SearchBar } from './../SearchBar/SearchBar';
import {SearchResults} from './../SearchResults/SearchResults';
import {Playlist} from './../Playlist/Playlist';
import spotify from '../util/Spotify'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {searchResults: [],
                  playListName: ['Playlist1'], 
                  playListTracks : []
                }
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlayList = this.savePlayList.bind(this);
  this.search = this.search.bind(this);
}
  addTrack(track){
    let tracks=this.state.playListTracks;
    if(tracks.find(savedTrack => savedTrack.id===track.id)){
      return;
    }
    tracks.push(track); 
    this.setState({playListTracks : tracks});
  }

  removeTrack(track){
    let tracks=this.state.playListTracks;
    tracks = tracks.filter(currentTrack=>currentTrack.id!==track.id);
    this.setState({playListTracks: tracks});
    
  }

  updatePlaylistName(name){
    this.setState({playListName:name});
  }

  savePlayList(){
    const trackUriS = this.state.playListTracks.map(track=>track.uri);
    spotify.savePlayList(this.state.playListName, trackUriS).then(()=>{
      this.setState({
        playListName: 'New Playlist',
        playListTracks: []
      })
    })
  }

  search(searchTerm){
    spotify.search(searchTerm).then(searchResults =>{
      this.setState({searchResults: searchResults})
    })
  }

  render()
  {
    return (
      <div>
        <h1> Ja <span className="highlight" > mmm </span>ing</h1>
        <div className="App" >
          <SearchBar onSearch = {this.search}/>
          <div className="App-playlist" >
            <SearchResults searchResults = {this.state.searchResults} 
                           onAdd={this.addTrack}
                           />
            <Playlist playListName = {this.state.playListName} 
                      playListTracks = {this.state.playListTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName}
                      onSave = {this.savePlayList}
                      />
          </div>
        </div>
      </div>
    );
  }
}

export default App;