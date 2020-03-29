/**-----------------------------------------------------------------------
 * Created on Sat Mar 28 2020
 *
 * Author : Hanafi Ya'kub
 *
 * Date of revision : Sat Mar 28 2020 2:18:31 AM
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
import { CInputWithIcon } from '.';
import { Card, ButtonGroup, InputGroup } from'reactstrap';
import { CButton } from './button';
import moment, { months } from 'moment';

export class CDatePicker extends Component {

  state = {
    isOpen : false,
    blurPrevention : false,
    selectedDate : null
  }

  cinput = React.createRef();

  componentDidMount() {
    let elem = document.getElementById('datePickerInput');
    elem.addEventListener('blur', this.handleBlurEvent);
    // elem.value = this.state.selectedDate;
  }

  handleBlurEvent = () => {
    if(this.state.blurPrevention){
      this.cinput.current.focus();
    }
  }

  componentWillUnMount = () => {
    document.removeEventListener('click', this.handleClickEvent);
    document.getElementById('datePickerInput')
    .removeEventListener('blur', this.handleBlurEvent);
  }

  componentDidUpdate(prevProps, prevStates) {
    let curIsOpen = this.state.isOpen;
    let prevIsOpen = prevStates.isOpen;
    if(prevIsOpen !== curIsOpen){
      if(curIsOpen)   {
        this.setState({blurPrevention : true}, () => {
          document.addEventListener('click', this.handleClickEvent )
        })
      } else {
        document.removeEventListener('click', this.handleClickEvent )
      }       
    }
  }

  handleClickEvent = e => {
    e.preventDefault();
    if(document.getElementById('calendar-box').contains(e.target)){
    }else {
      this.setState({isOpen : false, blurPrevention : false}, () => {
        document.getElementById('datePickerInput').blur();
      })
    }
  }

  toggleCalendar = () => {
    let { isOpen } = this.state;
    if(isOpen) {

    }
    else {
      this.setState({isOpen : true})
    }
  }

  calendarOnClicked = (e)=> {
    this.setState({blurPrevention : true})
  }

  updateDateValue = (value) => {
    this.setState({
      selectedDate : value
    }, () => {
      this.cinput.current.value = value;
      this.setState({
        isOpen : false,
        blurPrevention : false
      }, () => {
        this.cinput.current.blur()
      })
    })
  }


  render(){
    return (
      <div className ="datepicker">
        <InputGroup>
          <div className="c-input-w-icon right">
            <input
            placeholder="Select Date"
            contentEditable
            id= "datePickerInput"      
            ref = { this.cinput }
            className="form-control c-input" 
            onClick = { this.toggleCalendar }
            type ='text'/>
            <i className="fal fa-calendar-alt"></i>
          </div>
        </InputGroup>
        <CalendarContainer 
        updateDateValue= { this.updateDateValue }
        calendarOnClicked = { this.calendarOnClicked }
        isOpen = {this.state.isOpen} />
      
      </div>
    )
  }
}

class CalendarContainer extends Component {

  state = {
    dateContext : moment(),
    today: moment(),
    selectedDay : null,
    selectedMonth : null,
    selectedYear : null
  }



  todayYear = () => {
    return this.state.today.format('YYYY');
  }
  todayMonth = () => {
    return this.state.today.format('MMM');
  }
  todaysDate = () => {
    return this.state.today.format.get('date');
  }
  today = () => {
    return this.state.today.format("D");
  }

  year = () => {
    return this.state.dateContext.format('YYYY');
  }

  month = () => {
    return this.state.dateContext.format('MMM');
  }

  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  }

  currentDate = () => {
    return this.state.dateContext.get('date');
  }

  currentDay = () => {
    return this.state.dateContext.format('D');
  }

  firstDayOfTheMonth = () => {
    let { dateContext } = this.state;
    return moment(dateContext).startOf('month').format('d');
  } 


  setMonth = (month) => {
    let monthIndex = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthIndex);
    this.setState({ dateContext : dateContext });
  }


  
  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState({
        dateContext: dateContext
    });
    this.props.onNextMonth && this.props.onNextMonth();
  }

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({
        dateContext: dateContext
    });
    this.props.onPrevMonth && this.props.onPrevMonth();
  }

  nextYear = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "year");
    this.setState({
        dateContext: dateContext
    });
    this.props.onNextMonth && this.props.onNextMonth();
  }

  prevYear = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "year");
    this.setState({
        dateContext: dateContext
    });
  }

  selectTodayDate = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment();
    this.setState({
      dateContext : dateContext,
    },() => {
      this.setState({
        selectedDay : this.today(),
        selectedYear : this.todayYear(),
        selectedMonth : this.todayMonth()
      }, () => {
        let { selectedDay, selectedMonth, selectedYear } = this.state;
        let monthnumber = moment().month(selectedMonth).format('MM');
        let dayNumber = moment().year(selectedYear).month(monthnumber).date(selectedDay).format('DD')
        let a = `${selectedYear}-${monthnumber}-${dayNumber}`;
        this.props.updateDateValue(moment(a).format('Do MMM YYYY'))
      })
    })
  }



  /**
   * To set the class for display and hide Component
   */
  setDisplayState = () => {
    let { isOpen } = this.props;
    if(isOpen) { return 'cal-open'}
    return 'cal-close'
  }

  onDayClick = (e, day) => {
    this.setState({
      selectedDay: day,
      selectedYear : this.year(),
      selectedMonth : this.month()
    }, () => {
      let { selectedDay, selectedMonth, selectedYear } = this.state;
      let monthnumber = moment().month(selectedMonth).format('MM');
      let dayNumber;
      if(selectedDay === 31 ) {
        dayNumber = moment().year(selectedYear).endOf('month').format('DD');
      } else {
        dayNumber = moment().year(selectedYear).month(monthnumber).date(selectedDay).format('DD')
      }
      let a = `${selectedYear}-${monthnumber}-${dayNumber}`;
        this.props.updateDateValue(moment(a).format('Do MMM YYYY'))
    });
  }

  isToday = (d) => {
    let selectedMonth = this.month();
    let selectedYear = this.year();
    let todayMonth = this.todayMonth();
    let todayYear = this.todayYear();
    //check for months and year 
    if(selectedYear == todayYear && selectedMonth == todayMonth){
      if(d == this.currentDay()){
        return true;
      }
    }
  }

  setDayClass = (d) => {
    let isToday = this.isToday(d);
    let { selectedDay, selectedMonth, selectedYear } = this.state;
    let selectedDate = (d == selectedDay && selectedMonth === this.month() && selectedYear === this.year())
    if(isToday){
      if(selectedDate){
        return 'day selected-day'
      }
      return 'day current-day'
    }
    else if(selectedDate) {
      return 'day selected-day';
    }else {
      return 'day'
    }
  }

  renderCalendar = () => {
    let blanks = [];

    for (let i = 0; i < this.firstDayOfTheMonth(); i++) {
      blanks.push(
        <td key = {i*100} className= "blank">
          
        </td>
      )
    }

    let daysInMonth= [];

    for(let d = 1; d <= this.daysInMonth(); d++ ){
      daysInMonth.push(
        <td key={d} className = {this.setDayClass(d) }
        onClick={(e)=>{this.onDayClick(e, d)}}
        >
            <span >{d}</span>
        </td>
      )
      }

    let totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if ((i % 7) !== 0) {
        cells.push(row);
      } else {
          let insertRow = cells.slice();
          rows.push(insertRow);
          cells = [];
          cells.push(row);
      }
      if (i === totalSlots.length - 1) {
          let insertRow = cells.slice();
          rows.push(insertRow);
      }
    })

    let trElems = rows.map((d, i) => {
      return (
          <tr key={i*100}>
              {d}
          </tr>
      );
    })

    return trElems;

  }




  render () {
    // console.log(this.state)
    return (
      <div id = "calendar-box" className ={`calendar-box ${this.setDisplayState()}`}
      onClick = {this.props.calendarOnClicked }
      >
      <div className="cal-header">
        <ButtonGroup className = "cal-control">
          <CButton id ="a"
          onClick = { this.prevYear }
          icon = "fal fa-chevron-double-left"
          color = "link"
          size= "md"
          />
          <CButton id ="a"
          onClick = {e => this.prevMonth()}
          icon = "fal fa-chevron-left"
          color = "link"
          size= "md"
          />
        </ButtonGroup>
        <div className="cal-month-year">
          {this.month()} {this.year()}
        </div>
        <ButtonGroup>
          <CButton id ="a"
           onClick = {e => this.nextMonth()}
          icon = "fal fa-chevron-right"
          color = "link"
          size= "md"
          />
          <CButton id ="a"
          onClick = { this.nextYear }
          icon = "fal fa-chevron-double-right"
          color = "link"
          size= "md"
          />
        </ButtonGroup>
      </div>
      <div className="cal-body">
        <table size = "md" className="cal-table">
          <thead>
          <tr>
            <th>Su</th>
            <th>Mo</th>
            <th>Tu</th>
            <th>We</th>
            <th>Th</th>
            <th>Fr</th>
            <th>Sa</th>
          </tr>
          </thead>
          <tbody>
            { this.renderCalendar()}
          </tbody>
        </table>
      </div>

      <div className="cal-footer">
        <CButton 
        onClick = { this.selectTodayDate }
        className = "today-btn"
        size = "sm"
        color = "outline-primary"
        text = "Today"/>
      </div>
    </div>
    )
  }
}
