import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState /* AppDispatch */ } from "./store";
import { Client, URI, accumulateDetails, allCalories } from "../utils";
import { dayInterface, foodInterface } from "../models";

interface analytics {
  date: Date;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}

interface State {
  isAuthenticated: boolean;
  authError: string | null;
  day: dayInterface | null;
  analytics: Array<analytics> | null;
  food: Array<foodInterface>;
  view: "day" | "analytics";
  status: "loading" | "succeeded" | "failed";
}

const initialState: State = {
  isAuthenticated: true,
  authError: null,
  day: null,
  view: "day",
  analytics: null,
  food: [],
  status: "loading",
};

const msInMinute = 6e4;

export const daySlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchDay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchDay.fulfilled, (state, action) => {
        state.day = action.payload;
        state.status = "succeeded";
      })
      .addCase(searchDay.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = "failed";
      });
    builder
      .addCase(updateDay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDay.fulfilled, (state, action) => {
        state.day = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateDay.rejected, (state) => {
        state.status = "failed";
      });
    builder
      .addCase(getAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
        state.status = "succeeded";
      })
      .addCase(getAnalytics.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = "failed";
      });
    builder.addCase(searchFood.fulfilled, (state, action) => {
      state.food = action.payload;
      state.status = "succeeded";
    });
    builder
      .addCase(register.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.authError = null;
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state) => {
        state.authError = "Invalid username or password";
      });
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.authError = null;
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state) => {
        state.authError = "Invalid username or password";
      });
  },
});

export const register = createAsyncThunk(
  `auth/register`,
  async (
    userData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await Client.request("POST", new URI(`auth/register`), {
        username: userData.username,
        password: userData.password,
      });
      if (!res.jwt) throw new Error("Invalid username or password");
      document.cookie = `Bearer ${res.jwt}`;
      return res.jwt;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    userData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await Client.request("POST", new URI(`auth/login`), {
        username: userData.username,
        password: userData.password,
      });
      if (!res.jwt) throw new Error("Invalid username or password");
      document.cookie = `Bearer ${res.jwt}`;
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const searchDay = createAsyncThunk(
  `day/search`,
  async (date: Date, { rejectWithValue }) => {
    const msOffset = date.getTimezoneOffset() * msInMinute;
    const ISODate = new Date(date.getTime() - msOffset).toISOString();
    const res = await Client.request("POST", new URI(`api/days/search`), {
      date: ISODate,
    }).then((data) => {
      try {
        if (data.error && data.error === "Authentication required") {
          throw new Error(data.error);
        }
        data.day.breakfastDetails = accumulateDetails(data.day.breakfast);
        data.day.brunchDetails = accumulateDetails(data.day.brunch);
        data.day.lunchDetails = accumulateDetails(data.day.lunch);
        data.day.dinnerDetails = accumulateDetails(data.day.dinner);
        data.day.allCalories = allCalories(data.day);
        return data.day;
      } catch (err) {
        return rejectWithValue(err);
      }
    });
    return res;
  }
);

export const updateDay = createAsyncThunk(
  "day/update",
  async (day: dayInterface) => {
    const res = await Client.request("PUT", new URI(`api/days/update`), {
      ...day,
    }).then((data) => {
      data.day.breakfastDetails = accumulateDetails(data.day.breakfast);
      data.day.brunchDetails = accumulateDetails(data.day.brunch);
      data.day.lunchDetails = accumulateDetails(data.day.lunch);
      data.day.dinnerDetails = accumulateDetails(data.day.dinner);
      data.day.allCalories = allCalories(data.day);
      return data.day;
    });
    return res;
  }
);

type testType = {
  name: string;
  offset: number;
  limit: number;
};
export const searchFood = createAsyncThunk(
  `food/search`,
  async ({ name, offset, limit }: testType) => {
    return Client.request(
      "GET",
      new URI(`api/food/?name=:name&offset=:offset&limit=:limit`, {
        name,
        offset,
        limit,
      })
    )
      .then((data) => {
        return data.food;
      })
      .catch((err) => err);
  }
);

export const saveFood = createAsyncThunk(
  "food/add",
  async (food: foodInterface) => {
    const convertedFood = {
      ...food,
      weight: +food.weight,
      calories: +food.calories,
      protein: +food.protein,
      carbohydrate: +food.carbohydrate,
      fat: +food.fat,
    };
    const res = await Client.request("POST", new URI(`api/food`), {
      ...convertedFood,
    }).then((data) => data);
    return res;
  }
);

export const getAnalytics = createAsyncThunk(
  "day/analytics",
  async (limit: number = 7, { rejectWithValue }) => {
    const res = await Client.request(
      "GET",
      new URI(`api/analytics?limit=${limit}`)
    ).then((data) => {
      try {
        if (data.error && data.error === "Authentication required") {
          throw new Error(data.error);
        }
        return data.analytics;
      } catch (err) {
        return rejectWithValue(err);
      }
    });
    return res;
  }
);

export const { setIsAuthenticated } = daySlice.actions;

export const selectDay = (state: RootState) => state.day;

export const selectAnalytics = (state: RootState) => state.analytics;

export const selectFood = (state: RootState) => state.food;

export default daySlice.reducer;
