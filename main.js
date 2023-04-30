import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import Stamen from 'ol/source/Stamen';
import XYZ from 'ol/source/XYZ';
import Control from 'ol/control/Control';


const osmLayer = new TileLayer({
  type: 'base',
  title: 'OpenStreetMap',
  visible: true,
  source: new OSM()
});

const stamenTerrainLayer = new TileLayer({
  type: 'base',
  title: 'Stamen Terrain',
  visible: false,
  source: new Stamen({layer: 'terrain'})
});

const openSeaMapLayer = new TileLayer({
  title: 'OpenSeaMap',
  visible: false,
  source: new XYZ({
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
  })
});

const map = new Map({
  target: 'map',
  layers: [
    osmLayer,
    //stamenTerrainLayer,
    openSeaMapLayer
  ],
  view: new View({
    center: fromLonLat([27.702, 62.979]),
    zoom: 14
  })
});


function createLayerSwitcherControl() {
  const layerSwitcherControl = document.createElement('div');
  layerSwitcherControl.className = 'layer-switcher ol-unselectable ol-control';

  const layerList = document.createElement('ul');

  map.getLayers().forEach((layer) => {
    const layerTitle = layer.get('title');
    const layerType = layer.get('type');
    const layerElement = document.createElement('li');

    if (layerType === 'base') {
      const layerInput = document.createElement('input');
      layerInput.type = 'radio';
      layerInput.name = 'baseLayer';
      layerInput.checked = layer.getVisible();

      layerInput.addEventListener('change', function () {
        map.getLayers().forEach((otherLayer) => {
          if (otherLayer.get('type') === 'base') {
            otherLayer.setVisible(false);
          }
        });
        layer.setVisible(true);
      });

      layerElement.appendChild(layerInput);
    } else {
      const layerInput = document.createElement('input');
      layerInput.type = 'checkbox';
      layerInput.checked = layer.getVisible();

      layerInput.addEventListener('change', function () {
        layer.setVisible(this.checked);
      });

      layerElement.appendChild(layerInput);
    }

    const layerLabel = document.createElement('label');
    layerLabel.textContent = layerTitle;
    layerElement.appendChild(layerLabel);

    layerList.appendChild(layerElement);
  });

  layerSwitcherControl.appendChild(layerList);
  return layerSwitcherControl;
}

map.addControl(new Control({element: createLayerSwitcherControl()}));