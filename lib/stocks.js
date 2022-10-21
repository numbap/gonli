export async function getStockHistory(id) {
  console.log(
    `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${id}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
  )
  const res = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${id}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
  )
  let tmpRes = await await res.json()

  if (tmpRes['Weekly Time Series']) {
    console.log(
      '====================',
      Object.keys(tmpRes['Weekly Time Series'])
    )
  } else {
    tmpRes
  }

  if (tmpRes['Weekly Time Series']) {
    return tmpRes
  } else {
    return {
      'Weekly Time Series': [],
    }
  }
}

export async function getTSXSymbols() {
  const res = await fetch(
    `https://www.tsx.com/json/company-directory/search/tsx/%5E*`
  )
  return res.json()
}

export async function getAllSymbols() {
  const res = await fetch(
    `https://www.tsx.com/json/company-directory/search/tsx/%5E*`
  )

  console.log(res.json(), 'xxxxxxxxxxxxxxxxxxx')
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return res.json().results.map((x) => {
    return {
      params: {
        id: x.symbol,
      },
    }
  })
}
