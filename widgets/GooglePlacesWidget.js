var React = require('react');
import createReactClass from 'create-react-class';
var WidgetMixin = require('../mixins/WidgetMixin.js');

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');


module.exports = createReactClass({
  mixins: [WidgetMixin],
  
  getDefaultProps() {
    return {
      type: 'GooglePlacesWidget',
    };
  },
  
  render() {
    const everywhere = {description: 'Everywhere', geometry: { location: { lat: 0, lng: 0 } }};
    
    
    return (
      <GooglePlacesAutocomplete
        placeholder='Type a place'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = {}) => { // details is provided when fetchDetails = true
           var location = {};
           details.address_components.forEach(function(k, v1) {
              details.address_components[v1].types.forEach(function(k2, v2){
                  location[details.address_components[v1].types[v2]] = details.address_components[v1].long_name
              });
           });

          let venue = details.name.split(',')[0]
              venue = venue.split('-')[0]

          const result = {
            name: details.formatted_address,
            placeId: details.place_id,
            loc: {
              longitude: details.geometry.location.lng,
              latitude: details.geometry.location.lat,
            },
            types: details.types,
            location,
            venue
          }
          this._onChange(result);
          this.props.onClose(this.props.getVenue ? venue : details.formatted_address, this.props.navigator);
          this.props.onDone(result);
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={this.props.query}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        
        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        currentLocationAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'establishment',
        }}
        
        
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        
        // predefinedPlaces={[everywhere]}
        
        
        {...this.props} // @todo test sans (need for 'name')
      />
    );
  },
});