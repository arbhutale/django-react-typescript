import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authActions } from '.';
import { fetchWrapper } from '../_helpers';

// create slice

const name = 'invoice';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const invoiceActions = { ...slice.actions, ...extraActions };
export const invoiceReducer = slice.reducer;

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
        searchById: searchById(),
        getByCategory: getByCategory(),
        update: update(),
        delete: _delete()
    };

    function register() {
        return createAsyncThunk(
            `${name}/invoice`,
            async (invoice) => await fetchWrapper.post(`${baseUrl}/invoice/`, invoice)
        );
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}/invoice/`)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/invoice/${id}/`)
        );
    }
    function searchById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id) => await fetchWrapper.get(`${baseUrl}/invoices/${id}/`)
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
            async function ( {id, data, totalAmount} ) {
                let data1 = new FormData()
                data1.append('total_amount', totalAmount);
                for ( var key in data ) {
                    if(key == 'invoice'){
                        data1.append('items', JSON.stringify(data[key]));
                    }else  if(key == 'image'){
                        if(data.image[0]){
                          data1.append('image', data.image[0]);
                        }
                    }else  if(key == 'invoice_date'){
                        data1.append('invoice_date', formatterdate(data[key]))
                    }else  if(key == 'user'){
                        data1.append('invoice_user', data[key]);
                    }else{
                        data1.append(key, data[key]);
                    }
                    
                }
                await fetchWrapper.put(`${baseUrl}/invoice/${id}/`, data1);
            }
        );
    }
    function formatterdate (invoice_date_str)  {
        console.log(invoice_date_str)
        console.log(typeof(invoice_date_str))
        // Format the date components
        let datePart = new Date(invoice_date_str).toString()
        return datePart.split(" (")[0];
    
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
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
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
