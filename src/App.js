import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import menu from './menu.svg';
import './App.css';
import LocationList from './LocationList';
import Map from './Map';
import SearchFilter from './SearchFilter';
import ErrorBoundary from './ErrorBoundary';

const GOOGLE_MAPS_JS_API_KEY = 'REPLACE-WITH-YOUR-API-KEY';

const INFO_ERROR_MESSAGE = 'An error ocurred. Please try again.';

class App extends Component {
  state = {
    searchText: '',
    selectedLocationName: '',
    locationsInfo: {}
  }

  onSearchTextChange = (searchText) => {
    this.setState({ searchText })
  }

  onLocationListItemClick = (location) => {
    // console.log('selected list item location', location);
    this.setState({ selectedLocationName : location.name });
    this.getWikipediaInfoForLocation(location);
  }

  onMarkerClick = (location) => {
    // console.log('selected marker location', location);
    this.setState({ selectedLocationName : location.name });
    this.getWikipediaInfoForLocation(location);
  }

  getWikipediaInfoForLocation = (location) => {
    fetch(location.wikipediaUrl)
    .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
    .then(info => {
      // console.log(info)
      this.setState(({ locationsInfo }) => {
        locationsInfo[location.name] = info.extract;
        return { locationsInfo };
      })
    })
    .catch(error => {
      this.setState(({ locationsInfo }) => {
        locationsInfo[location.name] = INFO_ERROR_MESSAGE;
        return { locationsInfo };
      })
    });
  }

  onInfoWindowClosed = () => {
    this.setState({ selectedLocationName: '' });
  }

  render() {
    const { locations } = this.props;
    const { searchText, selectedLocationName, locationsInfo } = this.state;

    let filteredLocations;

    // filter
    if (searchText) {
      const match = new RegExp(escapeRegExp(searchText), 'i');
      filteredLocations = locations.filter(loc => match.test(loc.name));
    } else {
      filteredLocations = locations;
    }

    // sort
    filteredLocations.sort(sortBy('name'));

    // set 'selected'
    filteredLocations = filteredLocations.map(location => {
      if (location.name === selectedLocationName) {
        location.selected = true;
      } else {
        location.selected = false;
      }
      return location;
    });

    // set 'info'
    filteredLocations = filteredLocations.map(location => {
      const info = locationsInfo[location.name];
      if (info === INFO_ERROR_MESSAGE) {
        location.info = INFO_ERROR_MESSAGE;
      } else if (info) {
        location.info = 'From Wikipedia.org: ' + info;
      }
      return location;
    });

    return (
      <main className="App">
        <section className='left-container'>
          <div className='page-title-container'>
            <h1 className='page-title'>Catalonia Locations</h1>
          </div>
          <SearchFilter
            searchText={searchText}
            onSearchTextChange={this.onSearchTextChange}
          />
          <LocationList
            locations={filteredLocations}
            onLocationListItemClick={this.onLocationListItemClick}
          />
        </section>

        <section className='right-container'>
          <div className='right-container-top-bar'>
            <img src={menu}
              alt='Menu'
              className='menu-icon'
              role="navigation"
              aria-label='menu'
              tabIndex='0'
              onClick={() => {
                document.getElementsByClassName('left-container')[0].classList.toggle('hidden');
              }}
            />
          </div>
          <div className='map-container'>
            <ErrorBoundary errorMessage='Something went wrong. We could not load the map.'>
              <Map
                isMarkerShown
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_MAPS_JS_API_KEY}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `calc(100vh - 63px)` }}  role="application" aria-label="Map with catalan locations" />}
                mapElement={<div style={{ height: `100%` }} />}
                locations={filteredLocations}
                onMarkerClick={this.onMarkerClick}
                onInfoWindowClosed={this.onInfoWindowClosed}
              />
            </ErrorBoundary>
          </div>
        </section>
      </main>
    );
  }
}

App.propTypes = {
  locations: PropTypes.array.isRequired
};

export default App;
