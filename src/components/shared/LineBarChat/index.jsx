import Chart from 'react-apexcharts';

const DEFAULT_CATEGORIES = ['June', 'July', 'August', 'September', 'October', 'November'];
const DEFAULT_SERIES = [{ name: 'series-1', data: [1, 2, 2.5, 2.5, 3, 4] }];

/**
 * Reusable area/line chart. Falls back to demo data when no props are passed
 * so existing call sites keep working unchanged.
 */
export const LineBarChat = ({
  categories = DEFAULT_CATEGORIES,
  series = DEFAULT_SERIES,
  height = '350px',
  type = 'area',
  colors,
  yFormatter,
}) => {
  const optionSeries = {
    options: {
      chart: {
        id: 'basic-bar',
        toolbar: {
          show: false,
          tools: {
            zoom: false,
            zoomin: false,
            zoomout: false,
          },
        },
      },
      colors,
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.4,
          opacityTo: 0.4,
          type: 'vertical',
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories,
      },
      yaxis: {
        tickAmount: 3,
        labels: {
          formatter: yFormatter || ((value) => `${value}`),
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    series,
  };
  return (
    <div id="chart">
      <Chart options={optionSeries.options} series={optionSeries.series} type={type} width="100%" height={height} />
    </div>
  );
};
