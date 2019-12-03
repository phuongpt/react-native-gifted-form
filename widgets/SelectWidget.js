import React from 'react';
import createReactClass from 'create-react-class';
import {
  View,
  TextInput,
  PixelRatio
} from 'react-native';

var WidgetMixin = require('../mixins/WidgetMixin.js');


module.exports = createReactClass({
  mixins: [WidgetMixin],

  getDefaultProps() {
    return {
      type: 'SelectWidget',
      multiple: false,
      onSelect: () => {},
      onClose: () => {},
    };
  },

  getInitialState: function() {
    return {
      search: '',
      childrens: this.props.children
    };
  },

  unSelectAll() {
    React.Children.forEach(this._childrenWithProps, (child, idx) => {
      this.refs[child.ref]._onChange(false);
    });
  },

  updateRows(text = '') {
    if (text.length === 0) {
      this.setState({
        childrens: this.props.children
      });
      return;
    }

    const results = (this.props.children || []).filter(child=>{
  	 	var val = child.props.title;
  	 	return val.toLowerCase().indexOf(text.trim().toLowerCase()) > -1;
  	});
    this.setState({
      childrens: results
    });
  },

  doSearch(text) {
    this.setState({search: text});
    this.updateRows(text);
  },

  renderHeader() {
    return (
      <View
        style={[this.getStyle(['textInputContainer']), this.props.searchContainerStyle]}
      >
        <TextInput
          autoFocus={this.props.autoFocus}

          style={[this.getStyle(['textInput']), this.props.searchStyle]}

          placeholder={this.props.placeholder || 'Type a text...'}

          onChangeText={this.doSearch}
          value={this.state.search}

          clearButtonMode="while-editing"

        />
      </View>
    );
  },

  render() {
    this._childrenWithProps = React.Children.map(this.state.childrens, (child, idx) => {
      var val = child.props.value || child.props.title;

      return React.cloneElement(child, {
        formStyles: this.props.formStyles,
        openModal: this.props.openModal,
        formName: this.props.formName,
        navigator: this.props.navigator,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur,
        onValidation: this.props.onValidation,
        onValueChange: this.props.onValueChange,

        name: this.props.name+'{'+val+'}',
        ref: this.props.name+'{'+val+'}',
        value: val,
        unSelectAll: this.unSelectAll,

        multiple: this.props.multiple,
        onClose: this.props.onClose, // got from ModalWidget
        onSelect: this.props.onSelect, // got from DayPickerWidget
      });
    });

    return (
      <View>
      	{!!this.props.enableSearch && this.renderHeader()}
        {this._childrenWithProps}
      </View>
    );
  },

  defaultStyles: {
    textInputContainer: {
      backgroundColor: '#C9C9CE',
      height: 44,
      borderTopColor: '#7e7e7e',
      borderBottomColor: '#b5b5b5',
      borderTopWidth: 1 / PixelRatio.get(),
      borderBottomWidth: 1 / PixelRatio.get(),
    },
    textInput: {
      backgroundColor: '#FFFFFF',
      height: 28,
      borderRadius: 5,
      paddingTop: 4.5,
      paddingBottom: 4.5,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 7.5,
      marginLeft: 8,
      marginRight: 8,
      fontSize: 15,
    }
  },
});
