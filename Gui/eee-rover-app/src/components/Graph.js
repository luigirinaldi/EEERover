import React from "react";
import { AxisOptions, Chart } from 'react-charts';


    let Series = [
    {
      label: 'React Charts',
      data: [
        {
          date: new Date(),
          stars: 202123,
        }
        // ...
      ]
    },
  ]

export function MyChart() {

    let data = [
        {
          label: 'React Charts',
          data: [
            {
              date: new Date().getMonth(),
              stars: 23467238,
            },
            {
                date: new Date().getMonth() + 1,
                stars: 2555555,
            },
            {
                date: new Date().getMonth() + 2,
                stars: 2555204,
            },
            {
                date: new Date().getMonth() + 3,
                stars: 2512534,
            },
          ],
        },
    ]

    const primaryAxis = React.useMemo(
        () => ({
        getValue: datum => datum.date,
        }),        )

    const secondaryAxes = React.useMemo(
        () => [
        {
            getValue: datum => datum.stars,
            elementType: 'line',
        },
        ],
    )

    return (
        <Chart options={{
            data,
            primaryAxis,
            secondaryAxes,
        }}
        />
    )
}