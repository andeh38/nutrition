import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import { getAnalytics } from "../store/appSlice";

type dataType = {
  date: Date;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
};

const analyticsTypes = {
  date: "",
  calories: "Калорий",
  protein: "Белков",
  fat: "Жиров",
  carbohydrate: "Углеводов",
};

const Chart = ({
  data,
  type,
}: {
  data: Array<dataType> | null;
  type: keyof dataType;
}) => {
  const [placeholder, setPlaceholder] = useState<Highcharts.SVGElement | null>(
    null
  );
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    const chart = chartRef.current!.chart;
    const x = (chart.chartWidth - 137.35) / 2;
    const y = (chart.chartHeight - 25) / 2;
    const noData = chart.renderer.text("Нет данных", x, y).css({
      color: "#d53b3b",
      fontSize: "16px",
    });
    if (!data) {
      chart.showLoading();
      placeholder?.destroy();
    } else {
      if (data.length === 0) {
        chart.hideLoading();
        setPlaceholder(noData.add());
      } else {
        setPlaceholder(null);
        chart.hideLoading();
        chart.reflow();
      }
    }
  }, [data]);

  const options = useMemo(
    () => ({
      title: false,
      xAxis: {
        title: false,
        type: "datetime",
        dateTimeLabelFormats: {
          month: "%e. %b",
          year: "%b",
        },
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      /* lang: {
      shortMonths: ["Января", "Февраля", "March", "April", "May", "June", "July", "Сен", "Сен", "Сен", "Сен", "Сен"]
    }, */
      colors: ["#119931"],
      legend: false,
      tooltip: {
        headerFormat: "<b>{series.name}</b><br>",
        pointFormat: `{point.x:%e. %b}: {point.y:.0f} ${analyticsTypes[type]}`,
      },
      series: [
        {
          data:
            data?.map((d: dataType) => [new Date(d.date).getTime(), d[type]]) ||
            [],
          name: `Статистика ${analyticsTypes[type]}`,
        },
      ],
    }),
    [data]
  );

  return (
    <div>
      <h3 className="no-space">
        <span>{`Статистика ${analyticsTypes[type]}`}:</span>
      </h3>
      <div className="v-space">
        <div id="pageviews">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType={"chart"}
            ref={chartRef}
          />
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [period, setPeriod] = useState<string>("7");
  const { analytics } = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAnalytics(+period));
  }, [period]);

  return (
    <div>
      <nav className="flex flex-row-reverse">
        <div className="form-group" style={{margin: "1rem"}}>
        <label htmlFor="period">Период:</label>
        <select name="period" onChange={(e) => setPeriod(e.target.value)}>
          <option value="7">последние 7 дней</option>
          <option value="14">последние 14 дней</option>
          <option value="30">последние 30 дней</option>
          <option value="90">последние 90 дней</option>
        </select>
        </div>
      </nav>
      <div className="analytics-grid">
        <Chart data={analytics} type="calories" />
        <Chart data={analytics} type="protein" />
        <Chart data={analytics} type="fat" />
        <Chart data={analytics} type="carbohydrate" />
      </div>
    </div>
  );
};

export default Analytics;
