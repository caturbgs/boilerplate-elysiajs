import { createLoggerInstance } from "../libs/logger";
import type { BQTimestamp } from "../types/onm-suite/dashboard/waterfall";

const moduleLogger = createLoggerInstance("model/redis.ts");

export const Filter = {
  /**
   * Filtering data based of date
   * @param data array of object
   * @param startDate string
   * @param endDate string
   * @param keyDate string
   * @return filtered data
   */
  filterByDate<T = Record<string, unknown>>(
    data: T[],
    // data: {}
    startDate: string,
    endDate: string,
    keyDate = "date",
  ): T[] {
    return data.filter((item) => {
      const obj = item[keyDate as keyof T] as BQTimestamp;

      if (typeof obj === "object" && obj !== null && "value" in obj) {
        const date = new Date(obj.value);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return date >= start && date <= end;
      }
    });
  },

  /**
   * Filtering data based of year + week
   * @param data array of object
   * @param startWeek string
   * @param endWeek string
   * @return filtered data
   */
  filterByWeek<T = Record<string, unknown>>(data: T[], startWeek: string, endWeek: string, keyWeek = "week"): T[] {
    const [startWeeknum, startYear] = startWeek.split("-");
    const [endWeeknum, endYear] = endWeek.split("-");

    return data.filter((item) => {
      const obj = item[keyWeek as keyof T] as BQTimestamp;

      if (typeof obj === "object" && obj != null && "value" in obj) {
        const week = item[keyWeek as keyof T] as number;
        const year = item["year" as keyof T] as number;
        return (
          year + week >= Number(startYear) + Number(startWeeknum) && year + week <= Number(endYear) + Number(endWeeknum)
        );
      }
    });
  },

  /**
   * Filtering data based of year + month
   * @param data array of object
   * @param startMonth string
   * @param endMonth string
   * @return filtered data
   */
  filterByMonth<T = Record<string, unknown>>(data: T[], startMonth: string, endMonth: string, keyMonth = "month"): T[] {
    const [startMonthnum, startYear] = startMonth.split("-");
    const [endMonthnum, endYear] = endMonth.split("-");

    return data.filter((item) => {
      const obj = item[keyMonth as keyof T] as BQTimestamp;

      if (typeof obj === "object" && obj != null && "value" in obj) {
        const month = item[keyMonth as keyof T] as number;
        const year = item["year" as keyof T] as number;
        return (
          year + month >= Number(startYear) + Number(startMonthnum) &&
          year + month <= Number(endYear) + Number(endMonthnum)
        );
      }
    });
  },

  /**
   * Filtering data based of year
   * @param data array of object
   * @param startYear string
   * @param endYear string
   * @return filtered data
   */
  filterByYear<T = Record<string, unknown>>(data: T[], startYear: string, endYear: string, keyYear = "year"): T[] {
    return data.filter((item) => {
      const year = item[keyYear as keyof T] as number;
      return year >= Number(startYear) && year <= Number(endYear);
    });
  },

  /**
   * Filtering data based of plts
   * @param data array of object
   * @param plts list of plts id
   * @param keyPlts key of object plts that will be using filtered
   */
  filterByPlts<T = Record<string, unknown>>(data: T[], plts: string[], keyPlts = "plts_id"): T[] {
    if (plts.length === 0) {
      return data;
    }

    return data.filter((item) => {
      const obj = item[keyPlts as keyof T] as number | string;

      if (typeof obj === "number") {
        return plts.includes(obj.toString());
      }
      return plts.includes(obj);
    });
  },
};
