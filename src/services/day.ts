import { Client, URI } from "../utils";
import { DayModel, dayInterface } from "../models/";

function getDay(date: Date) {
  return Client.request("POST", new URI(`day/search`), {
    date: date.toLocaleDateString(),
  }).then((data) => new DayModel(data));
}

function updateDay(day: dayInterface) {
  return Client.request("PATCH", new URI(`day/${day.ID}`), {
    ...day!,
  }).then((data) => data);
}

function getAnalytics(limit = 7) {
  return Client.request("GET", new URI(`api/analytics?limit=${limit}`)).then(
    (data) => data.analytics
  );
}

export default {
  getDay,
  updateDay,
  getAnalytics,
};
