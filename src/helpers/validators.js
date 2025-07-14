import * as R from "ramda";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const allPass = (predicates) => (value) => {
  for (const predicate of predicates) {
    if (!predicate(value)) return false;
  }
  return true;
};

const anyPass = (predicates) => (value) => {
  for (const predicate of predicates) {
    if (predicate(value)) return true;
  }
  return false;
};

const isRed = (color) => color === "red";
const isGreen = (color) => color === "green";
const isBlue = (color) => color === "blue";
const isOrange = (color) => color === "orange";
const isWhite = (color) => color === "white";

const getStar = R.prop("star");
const getSquare = R.prop("square");
const getTriangle = R.prop("triangle");
const getCircle = R.prop("circle");

const countColorOfShapes = (color, shapes) =>
  R.count((shapeColor) => shapeColor === color, R.values(shapes));
const countColor = R.curry(countColorOfShapes);
const countRed = countColor("red");
const countBlue = countColor("blue");
const countGreen = countColor("green");
const countOrange = countColor("orange");

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  R.compose(isRed, getStar),
  R.compose(isGreen, getSquare),
  R.compose(isWhite, getTriangle),
  R.compose(isWhite, getCircle),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(R.gte(R.__, 2), countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(R.equals, [countBlue, countRed]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  R.compose(isBlue, getCircle),
  R.compose(isRed, getStar),
  R.compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  R.compose(R.gte(R.__, 3), countRed),
  R.compose(R.gte(R.__, 3), countBlue),
  R.compose(R.gte(R.__, 3), countGreen),
  R.compose(R.gte(R.__, 3), countOrange),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  R.compose(R.equals(2), countGreen),
  R.compose(isGreen, getTriangle),
  R.compose(R.equals(1), countRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.converge(R.equals, [
  R.compose(R.length, R.keys),
  countOrange,
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  R.compose(R.complement(isRed), getStar),
  R.compose(R.complement(isWhite), getStar),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.converge(R.equals, [
  R.compose(R.length, R.keys),
  countGreen,
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  R.converge(R.equals, [getSquare, getTriangle]),
  R.compose(R.complement(isWhite), getTriangle),
  R.compose(R.complement(isWhite), getSquare),
]);
