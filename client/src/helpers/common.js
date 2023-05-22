function getColorByGrade(grade) {
  let result = "#a6a6a6";
  if (!grade) return result;
  else if (grade <= 1.5) result = "#2acf06";
  else if (grade <= 2.5) result = "#67bf16";
  else if (grade <= 3.5) result = "#c4d600";
  else if (grade <= 4.5) result = "#d4b401";
  else if (grade > 4.5) result = "#d60000";
  return result;
}

export { getColorByGrade };
