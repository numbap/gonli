export const priceToDate = (startDate, startPrice, slope, endPrice, error) => {
  const days = Math.floor((endPrice - startPrice) / slope)
  console.log(days, startDate, new Date(startDate))
  var date = new Date(startDate)
  date.setDate(date.getDate() + days)
  if (date < new Date()) {
    return error
  } else {
    return `${date.toString()} ${endPrice}`
  }
}
