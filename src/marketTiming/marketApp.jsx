import React, { useState } from 'react';
import { Select, MenuItem, FormControlLabel, Radio, RadioGroup, Input } from '@material-ui/core'
import { round, toString, filter, isNaN } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import MarketSvg from './marketSvg.jsx';
import {
  DatePicker
} from '@material-ui/pickers';

const useStyles = makeStyles({
  intervalSelector: {
    marginLeft: "4px"
  },
  svgResponsive: {
    display: "inline-block",
    position: "absolute",
    top: "10px",
    left: "0"
  },
  inGreen: {
    color: "green"
  },
  inRed: {
    color: "red"
  },
  radioLabel: {
    marginLeft: "4px"
  },
  pickChange: {
    verticalAlign: "initial",
    marginLeft: "5px",
    marginRight: "5px"
  }
});


function monthlyToLump(v, intervalValue) {
  return round(v * (12 * intervalValue), 2);
}

function toUsd(v) {
  return new Intl.NumberFormat('en-US',
    { style: 'currency', currency: 'USD' }
  ).format(v);
}

function MarketApp(props) {

  const classes = useStyles();

  const [intervalValue, setYearInterval] = useState(20);
  const [radioValue, setRadioChange] = useState("monthly");
  const [startDate, setStartDate] = useState(moment("1950-01-01", "YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment("2020-01-01", "YYYY-MM-DD"));

  const handleSelect = (e) => {
    setYearInterval(e.target.value);
  }

  const handleRadioChange = (e) => {
    // if moving from lump to monthly set lump accordingly
    const newValue = e.target.value;
    setRadioChange(newValue);
  }

  const calcStartMinDate = (d) => {
    return moment("1871-1-1", "YYYY-MM-DD");
  }

  const calcStartMaxDate = (d) => {
    const copy = endDate.clone();
    copy.subtract(parseInt(intervalValue) + 1, "years");

    return copy;
  }

  const calcEndMaxDate = (d) => {
    return moment("2020-05-01", "YYYY-MM-DD");
  }

  const calcEndMinDate = (d) => {
    const copy = startDate.clone();
    copy.add(parseInt(intervalValue) + 1, "years");

    return copy
  }

  const yearsInMarket = filter(
    [1, 5, 10, 15, 20, 25, 30],
    (d) => {
      return d < endDate.diff(startDate, "years")
    }
  );
  const radioOptions = [{
    label: "Lump sum at beginning of period",
    value: "lump"
  }, {
    label: "Monthly Investment",
    value: "monthly"
  }, {
    label: "Compare Lump vs Monthly Returns",
    value: "compare"
  }]

  return (
    <div>
      <span>Years money in market:</span>
      <Select className={classes.intervalSelector} value={intervalValue} onChange={handleSelect}>
        {yearsInMarket.map((d) => {
          return (
            <MenuItem value={toString(d)}>{d}</MenuItem>
          )
        })}
      </Select>
      <div>
        <span>Between</span>
        <DatePicker
          disableToolbar
          autoOk={true}
          variant="inline"
          label="Start Date"
          value={startDate}
          onChange={(d) => setStartDate(d)}
          views={["year"]}
          format="MMM yyyy"
          className={classes.pickChange}
          minDate={calcStartMinDate()}
          maxDate={calcStartMaxDate()}
        />
        <span>and</span>
        <DatePicker
          disableToolbar
          autoOk={true}
          variant="inline"
          label="End Date"
          value={endDate}
          onChange={(d) => setEndDate(d)}
          views={["year"]}
          format="MMM yyyy"
          className={classes.pickChange}
          minDate={calcEndMinDate()}
          maxDate={calcEndMaxDate()}
        />
      </div>
      <div>
        {radioOptions.map((v, i) => {
          return (
            <div>
              <input type="radio" name="interactiveRadio" value={v.value} onChange={handleRadioChange} checked={v.value === radioValue}></input>
              <span className={classes.radioLabel}>{v.label}</span>
            </div>
          )
        })}
      </div>
      <MarketSvg data={props.data} yearInterval={parseInt(intervalValue)} startDate={startDate} endDate={endDate} granularity={radioValue}></MarketSvg>
    </div >
  );
}

export default MarketApp;