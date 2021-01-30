import React, { useState, useEffect, useRef } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

/* constants */

const LS_KEY = 'complex-calc-storage';

const initValue = {
  yearPercent: 10,
  yearNumber: 1,
  monthIncome: 0,
  startCount: 100000,
};

const defaultParam = (() => {
  const storageJSON = localStorage.getItem(LS_KEY) || '{}';
  const storage = JSON.parse(storageJSON);

  const {
    yearPercent = initValue.yearPercent,
    yearNumber = initValue.yearNumber,
    monthIncome = initValue.monthIncome,
    startCount = initValue.startCount,
  } = storage || {};

  return {
    yearPercent,
    yearNumber,
    monthIncome,
    startCount,
  };
})()

/* help functions */

function pretyBigNumb(num) {
  const numbStr = num.toLocaleString()
  return numbStr;
}

function getCalcRes({
  yearPercent = defaultParam.yearPercent,
  yearNumber = defaultParam.yearNumber,
  monthIncome = defaultParam.monthIncome,
  startCount = defaultParam.startCount,
} = {}) {
  const periodNumPerYear = 12;
  const monthPercent = 1 + (yearPercent / 100) / periodNumPerYear;
  const numberOfMonth = yearNumber * periodNumPerYear;

  const newRes = (() => {
    if (monthIncome) {
      let newRes = startCount;
      for (let i = 1; i <= numberOfMonth; i++) {
        newRes = Math.round(newRes * monthPercent * 100) / 100 + monthIncome;
      }

      return newRes;
    }

    return startCount * Math.pow(monthPercent, numberOfMonth);
  })();

  const roundedRes = Math.round(newRes);

  return roundedRes;
}

/* Main component */

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    marginLeft: 15,
    marginBottom: 15,
  },
  input: {
    minWidth: 250,
  },
  headerText: {
    textAlign: 'center',
    paddingTop: 20,
  }
}));

function App() {
  const classes = useStyles();

  const inputYearPercent = useRef();
  const inputStartCount = useRef();
  const inputMonthIncome = useRef();
  const inputYearNumber = useRef();

  const [result, setResult] = useState(0);

  useEffect(() => {
    const res = getCalcRes();

    setResult(res);

  }, [])

  const monthPassIncome = Math.round(result * 0.04 / 12);

  function handleDoCalc() {
    const yearPercent = parseInt(inputYearPercent.current.value);
    const yearNumber = parseInt(inputYearNumber.current.value);
    const monthIncome = parseInt(inputMonthIncome.current.value);
    const startCount = parseInt(inputStartCount.current.value);

    const param = {
      yearPercent,
      yearNumber,
      monthIncome,
      startCount,
    };
    const res = getCalcRes(param);

    const paramJSON = JSON.stringify(param);
    localStorage.setItem(LS_KEY, paramJSON);

    setResult(res);
  }

  return (
    <div className="App">
        <CssBaseline />
        <Container maxWidth="sm" className={classes.root}>
          <Typography component={'h1'} className={classes.headerText}>
            {"Калькулятор инвестиций"}
          </Typography>
          <List>
            <ListItem>
              <TextField
                className={classes.input}
                inputRef={inputStartCount}
                label="Первоначальная сумма"
                type="number"
                defaultValue={defaultParam.startCount}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.input}
                inputRef={inputYearPercent}
                label="Ставка, % годовых"
                type="number"
                defaultValue={defaultParam.yearPercent}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.input}
                inputRef={inputYearNumber}
                label="Количество лет"
                type="number"
                defaultValue={defaultParam.yearNumber}
              />
            </ListItem>
            <ListItem>
              <TextField
                className={classes.input}
                inputRef={inputMonthIncome}
                label="Ежемесячное пополнение"
                type="number"
                defaultValue={defaultParam.monthIncome}
              />
            </ListItem>
          </List>
          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            onClick={handleDoCalc}
          >
            Расчитать
          </Button>
          <Divider />
          <List>
            <ListItem>
              <Typography>
                {`Сумма к получению: ${pretyBigNumb(result)}`}
              </Typography>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Typography>
                {`4 % фонда / 12: ${pretyBigNumb(monthPassIncome)}`}
              </Typography>
            </ListItem>
          </List>
        </Container>
    </div>
  );
}

export default App;

