import React, { useState } from 'react'
import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import logger from '../lib/logger'
import { getStockHistory, getTSXSymbols, getAllSymbols } from '../lib/stocks'
import { useEffect } from 'react'
import TrendChart from '../components/TrendChart'
import SimpleLinearRegression from 'ml-regression-simple-linear'
import { priceToDate } from '../utils/predictors'
import { TextField, Grid } from '@mui/material'
import { fetchContent } from '../lib/cms'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { validateFloat, formatDate, no0 } from '../utils/math'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const errorMessage = 'Please enter a valid price...'
  const [targetPrice, setTargetPrice] = useState(0)
  const [targetDate, setTargetDate] = useState(errorMessage)

  logger.info('Detail page')
  logger.error('test')
  logger.warn('test')
  useEffect(() => {
    logger.debug('Detail mounted')
  }, [])

  return (
    <div
      id="homeContent"
      className="container mx-auto px-6 mt-5 bg-slate-300 p-8"
    >
      <div>
        <h1>
          <b>Stock Price Predictor {props.id}</b>
        </h1>
        <p>
          Enter a target stock price, and we will preditct the estimated target
          date for that price. (Based on 3 years historical trends)
        </p>
      </div>
      <br />

      <div>
        <br />
        <TextField
          id="outlined-basic"
          m={3}
          label="Price($)"
          variant="outlined"
          color="primary"
          sx={{ backgroundColor: 'white' }}
          value={targetPrice}
          placeholder={0}
          onChange={(e) => {
            e.preventDefault()
            if (
              validateFloat(e.target.value) &&
              parseFloat(e.target.value) >= 0
            ) {
              setTargetDate(
                priceToDate(
                  props.interceptDate,
                  props.intercept,
                  props.slope,
                  parseFloat(e.target.value),
                  errorMessage
                )
              )
              setTargetPrice(no0(e.target.value))
            }
            if (!e.target.value) {
              setTargetPrice(0)
              setTargetDate(errorMessage)
            }
          }}
        />
        <br />
        <br />
        <br />
        <p>{formatDate(targetDate)}</p>
        <br />
        <br />
      </div>

      <TrendChart data={props.priceHistory} symbol={props.id} />

      <Link href={`/home`}>
        <a>Back to Home</a>
      </Link>
    </div>
  )
}

// export async function getStaticPaths() {
//   let symbols = await getTSXSymbols()

//   console.log(symbols.results)
//   let justSymbols = symbols.results.map((x) => {
//     return {
//       params: {
//         id: x.symbol,
//       },
//     }
//   })

//   return {
//     paths: [...justSymbols],
//     fallback: false,
//   }
// }

export async function getServerSideProps({ locale, params }) {
  const content = await fetchContent()

  let id = params.id
  let priceHistory = await getStockHistory(params.id)
  const day = 1000 * 60 * 60 * 24

  console.log(priceHistory)

  priceHistory = Object.keys(priceHistory['Weekly Time Series']).map((x) => {
    return {
      date: x,
      close: parseFloat(priceHistory['Weekly Time Series'][x]['4. close']),
    }
  })

  // Format Price history and filter for last 3 years
  var date = new Date()
  date.setFullYear(date.getFullYear() - 3)
  date.setHours(0, 0, 0, 0)
  priceHistory = priceHistory.filter((x) => new Date(x.date) >= date)
  priceHistory = priceHistory.map((x) => {
    return {
      ...x,
      diff: Math.floor(
        (Date.parse(x.date) -
          Math.min(...priceHistory.map((x) => Date.parse(x.date)))) /
          day
      ),
    }
  })

  let interceptDate = new Date(
    Math.min(...priceHistory.map((x) => Date.parse(x.date)))
  )
  interceptDate = interceptDate.toString()
  console.log(interceptDate)
  // Perform regression analysis on the data
  const x = [...priceHistory.map((x) => x.diff)]
  const y = [...priceHistory.map((x) => x.close)]
  const regression = new SimpleLinearRegression(x, y)
  const slope = regression.slope
  const intercept = regression.intercept

  // Calculate date of intercept

  /* istanbul ignore next */
  const langToggleLink = locale === 'en' ? '/fr/home' : '/home'

  /* Place-holder Meta Data Props */
  const meta = {
    data_en: {
      title: 'Next Template - Home',
      desc: 'English',
      author: 'Service Canada',
      keywords: '',
    },
    data_fr: {
      title: 'Next Template - Accueil',
      desc: 'Français',
      author: 'Service Canada',
      keywords: '',
    },
  }

  return {
    props: {
      locale,
      langToggleLink,
      content,
      meta,
      priceHistory,
      slope,
      intercept,
      interceptDate,
      id,
    },
  }
}

Home.propTypes = {
  /**
   * current locale in the address
   */
  locale: PropTypes.string,

  /*
   * Meta Tags
   */
  meta: PropTypes.object,
}
