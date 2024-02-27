import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authActions } from '.';
import { fetchWrapper } from '../_helpers';

// create slice

const name = 'invoice_group';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const invoiceOptionActions = { ...slice.actions, ...extraActions };
export const invoiceOptionReducer = slice.reducer;

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
        registerCategory: registerCategory(),
        getAll: getAll(),
        getById: getById(),
        getByCategory: getByCategory(),
        update: update(),
        delete: _delete()
    };

    function registerCategory() {
        return createAsyncThunk(
            `${name}/categories`,
            async (option) => await fetchWrapper.post(`${baseUrl}/invoice_group/categories/`, option)
        );
    }

    function register() {
        return createAsyncThunk(
            `${name}/selections`,
            async (option) => await fetchWrapper.post(`${baseUrl}/invoice_group/selections/`, option)
        );
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}/invoice_group/categories/`)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async () => await fetchWrapper.get(`${baseUrl}/loans/`)
        );
    }

    function getByCategory() {
        return createAsyncThunk(
            `${name}/category`,
            async (category) => await fetchWrapper.get(`${baseUrl}/invoice_group/category/${category}`)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, data }, { getState, dispatch }) {
                await fetchWrapper.put(`${baseUrl}/${id}`, data);

                // update stored user if the logged in user updated their own record
                const auth = getState().auth.value;
                if (id === auth?.id.toString()) {
                    // update local storage
                    const user = { ...auth, ...data };
                    localStorage.setItem('auth', JSON.stringify(user));

                    // update auth user in redux state
                    dispatch(authActions.setAuth(user));
                }
            }
        );
    }

    // prefixed with underscore because delete is a reserved word in javascript
    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id, { getState, dispatch }) {
                await fetchWrapper.delete(`${baseUrl}/${id}`);

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
        getByCategory();
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

        function getByCategory() {
            var { pending, fulfilled, rejected } = extraActions.getByCategory;
            builder
                .addCase(pending, (state) => {
                    state.listc = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.listc = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.listc = { error: action.error };
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
