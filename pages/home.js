import React, { useState } from 'react'
import PropTypes from 'prop-types'
import en from '../locales/en'
import fr from '../locales/fr'
import logger from '../lib/logger'
import { getStockHistory, getTSXSymbols } from '../lib/stocks'
import { useEffect } from 'react'
import TrendChart from '../components/TrendChart'
import SimpleLinearRegression from 'ml-regression-simple-linear'
import { priceToDate } from '../utils/predictors'
import { TextField, Grid } from '@mui/material'
import { fetchContent } from '../lib/cms'
import Link from 'next/link'

export default function Home(props) {
  /* istanbul ignore next */
  const t = props.locale === 'en' ? en : fr
  const errorMessage = 'Please enter a valid price...'
  const [searchString, setSearchString] = useState('')

  logger.info('Home page')
  logger.error('test')
  logger.warn('test')
  useEffect(() => {
    logger.debug('Home mounted')
  }, [])

  return (
    <div
      id="homeContent"
      className="container mx-auto px-6 mt-5 bg-slate-300 p-8"
    >
      <div>
        <h1>
          <b>Stock Price Predictor</b>
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
          label="Search"
          variant="outlined"
          color="primary"
          sx={{ backgroundColor: 'white' }}
          value={searchString}
          placeholder="search"
          onChange={(e) => {
            e.preventDefault()
            setSearchString(e.target.value)
          }}
        />

        <br />
        <br />
      </div>
      <Grid container spacing={2}>
        {props.tsxSymbols.results
          .filter((x) =>
            `${x.name.toLowerCase()} ${x.name.toLowerCase()}`.includes(
              searchString
            )
          )
          .map((x, i) => {
            return (
              <Grid item xs={3} key={i}>
                <div>
                  {' '}
                  <Link href={`/${x.symbol}`}>
                    <a>{x.name}</a>
                  </Link>
                </div>
              </Grid>
            )
          })}
      </Grid>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const content = await fetchContent()

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

  let tsxSymbols = await getTSXSymbols()

  return {
    props: { locale, langToggleLink, content, meta, tsxSymbols },
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

{
  /* <TrendChart data={props.priceHistory} /> */
}
