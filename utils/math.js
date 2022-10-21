export const validateFloat = (str) => {
  if (str.slice(-1) === '.' && Number.isInteger(str.slice(0, -1))) {
    return true
  }

  if (!isNaN(str)) {
    return true
  }
  return false
}

export const formatDate = (date) => {
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  var output = new Date(date)

  if (isValidDate(output)) {
    return output.toLocaleDateString('en-US', options)
  } else {
    return date
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}
