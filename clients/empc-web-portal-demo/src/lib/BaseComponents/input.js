/**-----------------------------------------------------------------------
 * Created on Thu Mar 26 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Thu Mar 26 2020 10:38:43 PM
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
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

/**
 * This is the standard input without any addons
 * 
 * Example ```
 * 
 * 
 * ```
 * 
 * 
 */
export class CInput extends Component {

  state = {
    value : "",
    onFocus : false,
    isDisabled : false
  }

  isFocused = () => {
    return this.state.onFocus
  }

  isDisabled = () => {
    return this.state.isDisabled
  }

  inputValue = () => {
    return this.state.value;
  }

  setFocus = () => {
    this.setState({ onFocus : true }, () => {
      if(this.props.onFocus){
        this.props.onFocus()
      }
    })
  }

  setUnFocus = () => {
    this.setState({ onFocus : false }, () => {
      if(this.props.onUnFocus){
        this.props.onUnFocus()
      }
    })
  }


  handleOnChange = e => {
    this.setState({ value : e.target.value }, () => {
      if(this.props.onChange){
        this.props.onChange(this.state.value);
      }
    })
  }

  setType = () => {
    let { inputType } = this.props;
    if(inputType){
      switch(inputType){
        case 'text': return 'text'
        case 'number': return 'number'
        case 'password': return 'password'
        default : return 'text'
      }
    }
    return 'text'
  }

  render(){
    let { placeholder } = this.props;
    return (
      <Input
      onChange = { this.handleOnChange }
      onFocus = {this.props.parentHandlingFocus ? null : this.setFocus}
      onBlur = { this.props.parentHandlingFocus ? null : this.setUnFocus}
      disabled = { this.props.disabled ? this.props.disabled : false}
      type={this.setType()} 
      bsSize = {this.props.size}
      className="c-input" placeholder= {placeholder} />
    )
  }
}


/**
 * Input With button
 */
export class CInputWithButton extends Component {

  cInput =  React.createRef();

  componentDidMount() {
    let{ onSubmit } = this.props;
    if(onSubmit) {
      this.setEventQ(onSubmit);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', ()=> {});
  }


  setEventQ = (fn) => {
    let elem = this.cInput.current;
    document.addEventListener('keyup', function(e) {
      if(e.code === 'Enter'){
        if(elem.isFocused()){
          fn(elem.inputValue())
        }
      }
    })
  }
  childButtonOnClick = (fn) => {
    let elem = this.cInput.current;
    if(elem){
      fn(elem.inputValue())
    }
  }

  appendButton = () => {
    let buttonProps = this.props.button.props;
    let A = React.cloneElement(this.props.button, {
      ...buttonProps,
      onClick: () => this.childButtonOnClick(this.props.onSubmit)
    })
    return A;
  }

  setDirection = () => {
    let { direction, placeholder } = this.props;
    if(direction === 'right'){
      return (
        <React.Fragment>
            <CInput ref = {this.cInput} 
            inputType = {this.props.inputType ? this.props.inputType : ''}
            onChange = { this.props.onChange ? this.props.onChange : () => {} }
            placeholder = {placeholder} />
            <InputGroupAddon addonType="append">  
            { this.appendButton() }
            </InputGroupAddon>
        </React.Fragment>
      )
    } else {
     return (
      <React.Fragment>
        <InputGroupAddon addonType="prepend">    
          { this.appendButton() }
          </InputGroupAddon>
        <CInput ref = {this.cInput}  placeholder = {placeholder} />
      </React.Fragment>
     ) 
    }
  }



  render() {
    return (
      <InputGroup 
      size = { this.props.size}
      className = {this.props.className}>
      { this.setDirection() }
      </InputGroup>
    )
  }
}

export class CInputWithText extends Component {


  cInput =  React.createRef();

  componentDidMount() {
    let{ onSubmit } = this.props;
    if(onSubmit) {
      this.setEventQ(onSubmit);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', () => {});
  }


  setEventQ = (fn) => {
    let elem = this.cInput.current;
    document.addEventListener('keyup', function(e) {
      if(e.code === 'Enter'){
        if(elem.isFocused()){
          fn(elem.inputValue())
        }
      }
    })
  }

  setDirection = () => {
    let { direction } = this.props;
    if(direction === 'right'){
      return (
        <React.Fragment>
          <CInput 
          ref = {this.cInput}
          onChange = { this.props.onChange ? this.props.onChange : () => {} }
          placeholder = {this.props.placeholder}/>
          <InputGroupAddon addonType="append">
            <InputGroupText>To the Right!</InputGroupText>
          </InputGroupAddon>
        </React.Fragment>
      )
    }
    else {
      // by default if direction is not specified
      return (
        <React.Fragment>
           <InputGroupAddon addonType="prepend">
            <InputGroupText>{this.props.text}</InputGroupText>
          </InputGroupAddon>
          <CInput
           onChange = { this.props.onChange ? this.props.onChange : () => {} }
          placeholder = {this.props.placeholder} />
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <InputGroup>
        { this.setDirection() }
      </InputGroup>
    )
  }
}

export class CInputWithIcon extends Component {


  cInput =  React.createRef();

  componentDidMount() {
    let{ onSubmit } = this.props;
    if( onSubmit) {
      this.setEventQ(onSubmit);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', () => {});
  }


  setEventQ = (fn) => {
    let elem = this.cInput.current;
    document.addEventListener('keyup', function(e) {
      if(e.code === 'Enter'){
        if(elem.isFocused()){
          fn(elem.inputValue())
        }
      }
    })
  }

  setSizeClass = () => {
    let { size } = this.props;
    switch(size) {
      case 'sm' : return 'sm';
      case 'md' : return 'md';
      case 'lg' : return 'lg'
      default : return 'md'
    }
  }

  setDirectionClass = () => {
    let { direction }  = this.props;
    if(direction === 'right'){
      return 'right'
    }else {
      return 'left'
    }
  }

  render() {
    return (
      <InputGroup>
         <div className={`c-input-w-icon ${this.setDirectionClass()} ${this.setSizeClass()}`}>
            <CInput 
            ref = {this.cInput}
            {...this.props}
            onChange = { this.props.onChange ? this.props.onChange : () => {} }
            placeholder = {this.props.placeholder} />
            <i className={this.props.icon}/>
          </div>
      </InputGroup>
    )
  }
}