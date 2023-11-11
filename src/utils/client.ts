import { URI } from "./uri";

export const baseURL = "http://192.168.0.13:8000/";

const Config = {
  request: {
    options: {
      mode: "cors",
      cache: "no-cache",
    },
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  },
};

export function getToken(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      if (cookie.substring(0, name.length + 1)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue || "";
}

function preparePayload(payload: object | null | string) {
  if (payload === null) return null;
  if (typeof payload === "object") return JSON.stringify(payload);
  return new String(payload).toString();
}

function getJSON(response: Response) {
  if ((response.headers.get("content-type") || "").indexOf("json") > -1)
    return response.json();
  else return { status: response.status };
}

/* const HandleErrors = (response: Response) => {
  if (response.status === 401 && !response.ok) {
    window.location.assign("/auth");
    throw response;
  }
  return response;
}; */

interface opts {
  handleErrors: boolean;
  headers?: HeadersInit;
  options?: object;
  processData?: boolean;
}

export const Client = {
  request(
    type: string,
    url: URI,
    payload: Record<string, any> = {},
    opts: opts = { handleErrors: true }
  ): Promise<any> {
    const token = getToken("Bearer");
    const requestUrl = url.isAbsolute ? url.url : baseURL + url.url;
    const options: RequestInit = {
      method: type,
      headers: new Headers({
        ...(opts.headers || Config.request.headers),
        "Authorization": `Bearer ${token}`,
      }),
      ...(opts.options || Config.request.options),
    };
    if (Object.keys(payload).length !== 0)
      options.body = preparePayload(payload);
    const request = new Request(requestUrl, options);
    return fetch(request)
      //.then(HandleErrors)
      .then((response) =>
        opts.processData === false
          ? { status: response.status }
          : getJSON(response)
      );
  },
};
