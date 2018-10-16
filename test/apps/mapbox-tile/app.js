/* global document fetch window */
/* eslint-disable no-console */
import React, {Component} from 'react';
import {render} from 'react-dom';
import DeckGL from 'deck.gl';
import TileLayer from '../../../modules/experimental-layers/src/tile-layer/tile-layer';

import {decodeTiles} from './utils/decode';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -122.45,
  latitude: 37.78,
  zoom: 12,
  minZoom: 2,
  maxZoom: 14,
  height: window.innerHeight,
  width: window.innerWidth
};

const MAP_LAYER_STYLES = {
  stroked: false,

  getLineColor: [192, 192, 192],

  getFillColor: f => {
    switch (f.properties.layer) {
      case 'water':
        return [140, 170, 180];
      case 'landcover':
        return [120, 190, 100];
      default:
        return [218, 218, 218];
    }
  },

  getLineWidth: f => {
    if (f.properties.layer === 'transportation') {
      switch (f.properties.class) {
        case 'primary':
          return 12;
        case 'motorway':
          return 16;
        default:
          return 6;
      }
    }
    return 1;
  },
  lineWidthMinPixels: 1,

  getPointRadius: 100,
  pointRadiusMinPixels: 2,
  opacity: 1
};

class Root extends Component {
  fetchData(x, y, z) {
    const mapSource = `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/${z}/${x}/${y}.vector.pbf?access_token=${MAPBOX_TOKEN}`;
    const eventPromise = fetch(mapSource);
    return eventPromise
      .then(response => {
        return response.arrayBuffer();
      })
      .then(buffer => {
        return decodeTiles(x, y, z, buffer);
      });
  }

  render() {
    return (
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[
          new TileLayer({
            ...MAP_LAYER_STYLES,
            pickable: true,
            fetchData: this.fetchData
          })
        ]}
      />
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));