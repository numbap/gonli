import React, { Component } from 'react'
import Chart from 'react-google-charts'
// const TrendData = [
//   ['Diameter', 'Age'],
//   [8, 37],
//   [4, 19.5],
//   [11, 52],
//   [4, 22],
//   [3, 16.5],
//   [6.5, 32.8],
//   [14, 72],
//]

// const TrendOptions = {
//   title: 'Age of sugar maples vs. trunk diameter, in inches',
//   hAxis: { title: 'Diameter' },
//   vAxis: { title: 'Age' },
//   legend: 'none',
//   trendlines: { 0: {} },
// }
const TrendChart = ({ data, symbol, horizontal, vertical }) => {
  const TrendOptions = {
    title: `Price trends for ${symbol}`,
    hAxis: { title: 'Date' },
    vAxis: { title: 'Price' },
    legend: 'none',
    trendlines: { 0: {} },
  }

  const TrendData = [
    ['Date', 'Price'],
    ...data.map((x) => [new Date(x.date), x.close]),
  ]

  return (
    <div>
      <Chart
        width={'600px'}
        height={'350px'}
        chartType="ScatterChart"
        loader={<div>Loading Chart</div>}
        data={TrendData}
        options={TrendOptions}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  )
}
export default TrendChart
