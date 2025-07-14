import * as R from "ramda";

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";

const api = new Api();

const isValidLength = R.allPass([
  R.compose(R.gt(R.__, 2), R.length),
  R.compose(R.lt(R.__, 10), R.length),
]);

const isValidNumber = R.test(/^[0-9]+\.?[0-9]*$/);

const isPositiveNumber = R.compose(R.gt(R.__, 0), parseFloat);

const validateInputValue = R.allPass([
  R.is(String),
  R.compose(R.not, R.isEmpty),
  isValidLength,
  isValidNumber,
  isPositiveNumber,
]);

const roundNumber = R.pipe(parseFloat, Math.round);

const logAndReturn = R.curry((writeLog, value) => {
  writeLog(value);
  return value;
});

const tapLog = R.curry((writeLog, value) => {
  writeLog(value);
  return Promise.resolve(value);
});

const square = (x) => x * x;
const modulo3 = (x) => x % 3;

const extractResult = R.prop("result");

const pipeP =
  (...fns) =>
  (value) =>
    fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(value));

const convertToBase2 = (number) =>
  api.get("https://api.tech/numbers/base", {
    from: 10,
    to: 2,
    number: number,
  });

const getAnimal = (remainder) =>
  api.get(`https://animals.tech/${remainder}`, {});

const processAsyncSequence = (roundedNumber, writeLog) =>
  pipeP(
    convertToBase2,
    R.pipe(extractResult, tapLog(writeLog)),
    R.pipe(R.length, tapLog(writeLog)),
    R.pipe(square, tapLog(writeLog)),
    R.pipe(modulo3, tapLog(writeLog)),
    getAnimal,
    extractResult
  )(roundedNumber);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = logAndReturn(writeLog);

  log(value);

  if (!validateInputValue(value)) {
    handleError("ValidationError");
    return;
  }

  const roundedNumber = R.pipe(roundNumber, log)(value);

  processAsyncSequence(roundedNumber, writeLog)
    .then(handleSuccess)
    .catch(() => handleError("NetworkError"));
};

export default processSequence;
