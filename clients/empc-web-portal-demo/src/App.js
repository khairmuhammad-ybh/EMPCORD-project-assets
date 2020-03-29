import React from 'react';
import './App.css';
import './lib/empc-styles/css/empc-styles.css';
import '@fortawesome/fontawesome-pro/css/all.css';
import { Container, Row, Col , ButtonGroup } from 'reactstrap';
import { CButton, CInputWithButton, CInputWithText,CInputWithIcon, CInput } from './lib/BaseComponents';
import { CDatePicker } from './lib/BaseComponents/datepicker';


function App() {
  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md="12" className="">

         <CDatePicker />

         {/* <CButton id = 'cs' size='md'
          text= "Warning"
          icon = "fas fa-house"
          className="ml-0 mt-3"
          color = "link"/> */}
          {/* <CInputWithButton placeholder= "Hello World"
          onSubmit = {(result) => {console.log(result)}}
          direction ="right"
          size = "md"
          className="mb-3"
          button = {<CButton 
            id = "search-btn" text = "Search" color= "primary" icon = "fal fa-search"/>}
          /> */}

          {/* <CInputWithText placeholder = "Input with text"
          onSubmit = {(result) => {console.log(result)}}
          direction = 'right'
          size = "md"
          text = "Sim $"
          className = "mb-3"/> */}


          {/* <ButtonGroup>
          <CButton id = 'ce' size='md'
          text= "Sign in"
          icon = "fas fa-lock"
          className="mt-3"
          color = "primary"/>

          <CButton id = 'cs' size='md'
          text= "Warning"
          icon = "fas fa-exclamation"
          className="ml-0 mt-3"
          color = "light"/>

           <CButton id = 'cdds' size='md'
          text= "Danger"
          // icon = "fas fa-exclamation"
          className="ml-0 mt-3"
          type = "pill"
          color = "light"/>

          <CButton id = 'cdds' size='md'
      
          icon = "fas fa-home"
          className="ml-0 mt-3"
          // type = "pill"
          color = "light"/>
          </ButtonGroup> */}
        </Col>
       
      </Row>
    </Container>
  );
}
export default App;
