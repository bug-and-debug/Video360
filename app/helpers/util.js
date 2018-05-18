const safeToFloat = function(val) {
  let result = 0
  result = parseFloat(val)
  if (isNaN(result))
    result = 0
  return result
}

const safeToInt = function(val) {
  let result = 0
  result = parseInt(val)
  if (isNaN(result))
    result = 0
  return result
}

const convertToDateFormat = function(str) {
   return str.split('/')[2] + '-' + ('0' + str.split('/')[0]).slice(-2) + '-' + ('0' + str.split('/')[1]).slice(-2)
}


module.exports = {
  safeToInt,
  safeToFloat,
  convertToDateFormat,
}
