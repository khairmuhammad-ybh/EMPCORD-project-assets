/**-----------------------------------------------------------------------
 * Created on Thu Mar 26 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Thu Mar 26 2020 5:35:53 PM
 *
 * Project : EMPC - EMPCORD Projects
 *
 * Project Founder : Jatizso
 *
 * Copyright (c) 2020 Contributor - Napihup
 * No license for distribution, intended to be used only within the project
 *
--------------------------------------------------------------------------*/
import React, { Component } from 'react';
import { Button } from 'reactstrap';

/**
 * Custom Event Listeners
 * listenHover : return
 * listenFocus : 
 * listenDisabled :
 */
export class CButton extends Component {

  state = {
    disable: false,
    onFocus : false,
    onHover : false
  }


  componentDidUpdate(prevProps, prevState) {
    this.handleHoverStateChange(prevState);
    this.handledisableStateChange(prevState);
    this.handleOnFocusStateChange(prevState);
  }


  handleHoverStateChange = (prevState) => {
    if(this.props.listenHover){
      let curHoverState = this.state.onHover;
      if(prevState.onHover !== curHoverState){
        this.props.listenHover(curHoverState);
      }
    }
  }

  handleOnFocusStateChange = (prevState) => {
    if(this.props.listenFocus){
      let curFocusState = this.state.onFocus;
      if(prevState.onFocus !== curFocusState){
        this.props.listenFocus(curFocusState);
      }
    }
  }

  handledisableStateChange = (prevState) => {
    if(this.props.listenDiabled){
      let curdisabledState = this.state.isDisabled;
      if(prevState.isDisabled !== curdisabledState){
        this.props.listenDiabled(curdisabledState);
      }
    }
  }

  isDisabled = () => {
    return this.state.disable;
  }

  onFocused = () => {
    return this.state.onFocus;
  }

  isHovered = () => {
    return this.state.onHover;
  }


  // can be use on parent component
  disabled = () => { this.setState({isDisabled : true})}
  enable = () => {this.setState({isDisabled : false})}


  renderIcon = () => {
    let { icon } = this.props;
    if(icon){
      return <i className ={icon} />
    }
  }

  setStyleWithText = () => {
    let { text } = this.props;
    if(text){
      return 'with-text'
    }
  }

  filterProps = () => {
    let list = this.props;
    let filteredProps = {}
    let v = Object.keys(list);
    
    let filteredKey = v.filter(item => {
      let unwantedKeys = ["listenHover" , "listenFocus" , "listenDisabled"
      , "icon" , "text", "type"]      
      return !unwantedKeys.includes(item);
    })

    for(var i = 0; i < filteredKey.length; i++){
      let key = filteredKey[i];
      filteredProps[key] = list[key];
    }

    return filteredProps;
  }

  setType = () => {
    return this.props.type;
  }

  addedCustomClasses = () => {
    return this.props.className;
  }

  setButtonType = () => {
    let { color } = this.props;
    if(color === 'link'){
      return 'c-button-link'
    }else {
      return 'c-button'
    }
  }

  render(){
    this.filterProps();
    return (
      <Button id = {this.props.id} 
      {...this.filterProps()} 
      className={`${this.setButtonType()} ${this.setStyleWithText()} ${this.setType()} ${this.addedCustomClasses()}`}
      onMouseEnter = { () => this.setState({onHover : true})}
      onMouseLeave = { () => this.setState({onHover : false})}>
      {this.renderIcon()}
      {this.props.text}
      </Button>
    )
  }
}