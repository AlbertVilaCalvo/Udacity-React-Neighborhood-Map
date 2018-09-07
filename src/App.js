import React, { Component } from 'react';
import menu from './menu.svg';
import './App.css';
import Map from './Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='left-container'>
          <div className='page-title-container'>
            <h1 className='page-title'>Catalonia Locations</h1>
          </div>
          <div className='search-container'>
            <input className='search-input' placeholder='Station location' />
            <button className='search-button'>Filter</button>
          </div>
          <ul>
            {this.props.locations.map(location =>
              <li key={location.name}>{location.name}</li>
            )}
          </ul>
        </div>

        <div className='right-container'>
          <div className='right-container-top-bar'>
            <img src={menu} alt='Menu' className='menu-icon'/>
          </div>
          <div className='map-container'>
            <Map
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100vh` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
