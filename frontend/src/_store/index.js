import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { loanReducer } from './loan.slice';
import { transactionReducer } from './transaction.slice';
import { selectReducer } from './select.slice';
import { commonReducer } from './common.slice';
import { invoiceOptionReducer } from './invoice_group.slice';
import { invoiceUserReducer } from './invoice_user.slice ';
import { invoiceReducer } from './invoice.slice';
import { bankReducer } from './bank.slice';

export * from './alert.slice';
export * from './auth.slice';
export * from './users.slice';
export * from './loan.slice';
export * from './transaction.slice';
export * from './select.slice';
export * from './common.slice';
export * from './invoice_group.slice';
export * from './invoice_user.slice ';
export * from './invoice.slice'
export * from './bank.slice'

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        users: usersReducer,
        invoiceUser: invoiceUserReducer,
        loans: loanReducer,
        transactions: transactionReducer,
        select: selectReducer,
        common: commonReducer,
        invoiceOption: invoiceOptionReducer,
        invoice: invoiceReducer,
        bank: bankReducer,
    },
});