var React = require('react');
var {
  View,
  DatePickerIOS,
  PixelRatio,
  Platform,
  DatePickerAndroid
  } = require('react-native')

var WidgetMixin = require('../mixins/WidgetMixin.js');

module.exports = React.createClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'DatePickerWidget',
      getDefaultDate: () => { return new Date(); }
    };
  },

  getInitialState() {
    return {
      value: new Date(),
    };
  },

  async showPicker (options) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        this.props.onDone()
      } else {
        var date = new Date(year, month, day);
        this._onChange(date);
        this.props.onClose(date, this.props.navigator);
        this.props.onDone()
      }
    } catch ({code, message}) {
    }
  },


  componentDidMount() {
    if(Platform.OS === 'android'){
      this.showPicker({date: this.props.getDefaultDate()})
    }
    this._onChange(this.props.getDefaultDate());
  },

  render() {
    let view = <View style={this.getStyle('row')}></View>
    if(Platform.OS === 'ios'){
      view = (
        <View style={this.getStyle('row')}>
          <DatePickerIOS
            style={this.getStyle('picker')}

            {...this.props}

            onDateChange={this._onChange}
            date={this.state.value}
            />
        </View>
      )
    }
    return view;
  },

  defaultStyles: {
    row: {
      backgroundColor: '#FFF',
      borderBottomWidth: 1 / PixelRatio.get(),
      borderColor: '#c8c7cc',
    },
    picker: {
    },
  },

});
