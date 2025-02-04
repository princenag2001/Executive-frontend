import { configureStore } from '@reduxjs/toolkit';

// Example slice
const exampleSlice = {
  name: 'example',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    }
  }
};

const store = configureStore({
  reducer: {
    example: exampleSlice.reducer
  }
});

export default store;
