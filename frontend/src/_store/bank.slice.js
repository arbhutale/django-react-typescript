import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authActions } from '.';
import { fetchWrapper } from '../_helpers';

// create slice

const name = 'bank';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const bankActions = { ...slice.actions, ...extraActions };
export const bankReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: null,
        item: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/api`;

    return {
        register: register(),
        getAll: getAll(),
        getById: getById(),
        update: update(),
        delete: _delete()
    };

    function register() {
        return createAsyncThunk(
            `${name}/bank`,
            async (transaction) => await fetchWrapper.post(`${baseUrl}/bank-accounts/`, transaction)
        );
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}/bank-accounts/`)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/bank-accounts/${id}`)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, data }, { getState, dispatch }) {
                await fetchWrapper.put(`${baseUrl}/bank-accounts/${id}/`, data);
            }
        );
    }

    // prefixed with underscore because delete is a reserved word in javascript
    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id, { getState, dispatch }) {
                await fetchWrapper.delete(`${baseUrl}/${id}/`);

                // auto logout if the logged in user deleted their own record
                if (id === getState().auth.value?.id) {
                    dispatch(authActions.logout());
                }
            }
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getAll();
        getById();
        _delete();

        function getAll() {
            var { pending, fulfilled, rejected } = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function getById() {
            var { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });
        }
        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const user = state.list.value.find(x => x.id === action.meta.arg);
                    user.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const user = state.list.value.find(x => x.id === action.meta.arg);
                    user.isDeleting = false;
                });
        }
    }
}
