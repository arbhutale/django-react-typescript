import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import Select from 'react-select';


import { history } from '../_helpers';
import { transactionActions, alertActions, selectActions, commonActions, invoiceActions } from '../_store';
import './index.css'

export { AddEdit };
function AddEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState();
    const [invoice, setInvoice] = useState();
    const dispatch = useDispatch();
    const user = useSelector(x => x.users?.item);
    const transactions = useSelector(x => x.transactions?.item);
    // const invoice = useSelector(x => x.invoice?.list);
    const transactionSources = useSelector(x => x.select?.list) || [];
    const source = useSelector(x => x.common?.list) || [];
    const [loader, setLoader] = useState(true);
    const [flag, setFlag] = useState(true);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        transaction_type: Yup.string()
            .required('Transaction Type is required'),
        transaction_method: Yup.string()
            .required('Transaction Method is required'),
        transaction_source: Yup.string()
            .required('Transaction Source is required'),
        amount: Yup.string()
            .required('Transaction Amount is required'),
        description: Yup.string()
            .required('Transaction Description is required'),
        invoice: Yup.string()
            .required('Transaction Description is required'),
        transaction_date: Yup.date()
            .transform((originalValue, originalObject) => {
                if (originalValue instanceof Date) {
                    return originalValue;
                }
                // Parse the input string into a Date object
                const dateObject = new Date(originalValue);

                // Format the Date object to 'YYYY-MM-DD'
                const formattedDate = dateObject.toISOString().split('T')[0];
                return formattedDate;
            })
            .required('Date of Transaction is required')
            .max(moment().format('YYYY-MM-DD'), 'Future date not allowed'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (id) {
            setTitle('Edit Transaction');
        } else {
            setTitle('Add Transaction');
        }
        if (id && flag) {

            // fetch user details into redux state and 
            // populate form fields with reset()

            dispatch(transactionActions.getById(id)).unwrap()
                .then(transactions => {
                    handleTransactionMethodChange(transactions.transaction_method)
                        .then(() => {
                            reset(transactions)
                            dispatch(invoiceActions.getAll()).unwrap()
                                .then(data => {
                                    setInvoice(data);
                                    if (transactions.invoice) {
                                        setSelectedInvoice(parseInt(transactions.invoice))
                                        const invoiceOption = data.find(item => item.id === transactions.invoice); // Replace selectedInvoiceFromBackend with the actual value from the backend
                                        if (invoiceOption) {
                                            setSelectedInvoice({ value: invoiceOption.id, label: invoiceOption.id }); // Set the option with both value and label
                                            setLoader(false)
                                            setFlag(false)
                                        }
                                    }
                                    
                                })
                                
                        })
                        // setLoader(false)
                        
                });
        } else {
            
            dispatch(invoiceActions.getAll()).unwrap()
                .then(data => {
                    setInvoice(data);
                    if(id == undefined){
                        setLoader(false)
                    }
                })
                
        }


    }, [loader]);

    const handleTransactionMethodChange = async (selectedMethod) => {
        try {
            if (selectedMethod === "bank") {
                await dispatch(selectActions.getByCategory(selectedMethod)).unwrap();
                await dispatch(commonActions.getAll("bankaccount")).unwrap();
            }
            if (selectedMethod === "bank_upi") {
                await dispatch(selectActions.getByCategory("upi")).unwrap();
                await dispatch(commonActions.getAll("bankaccount")).unwrap();
            }
            if (selectedMethod === "credit_upi") {
                await dispatch(selectActions.getByCategory("upi")).unwrap();
                await dispatch(commonActions.getAll("creditcard")).unwrap();
            }
            if (selectedMethod === "credit_card") {
                await dispatch(selectActions.getByCategory("none")).unwrap();
                await dispatch(commonActions.getAll("creditcard")).unwrap();
            }
            if (selectedMethod === "debit_card") {
                await dispatch(selectActions.getByCategory("none")).unwrap();
                await dispatch(commonActions.getAll("bankaccount")).unwrap();
            }
            if (selectedMethod === "wallet") {
                await dispatch(selectActions.getByCategory("none")).unwrap();
                await dispatch(commonActions.getAll(selectedMethod)).unwrap();
            }

        } catch (error) {
            dispatch(alertActions.error(error));
        }
    };
    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            // create or update user based on id param
            let message;
            const formattedDate = data.transaction_date.toISOString().split('T')[0];
            data.transaction_date = formattedDate
            if (id) {
                await dispatch(transactionActions.update({ id, data })).unwrap();
                message = 'Transaction updated';
            } else {
                await dispatch(transactionActions.register(data)).unwrap();
                message = 'Transaction added';
            }

            // redirect to user list with success message
            history.navigate('/transactions');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const handleChange = (selectedOption) => {
        setSelectedInvoice(selectedOption);
    };
    return (
        <>
            <h1>{title}</h1>
            {loader?<div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>:<span>
            {!(user?.loading || user?.error)  &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Transaction Type </label>
                            <select name='transaction_type' className={`form-control selectlokacija ${errors.transaction_type ? 'is-invalid' : ''}`}
                                {...register("transaction_type")}
                            >
                                <option value="">Select Type</option>
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                                {/* <option value="self">Self</option> */}
                            </select>
                            <div className="invalid-feedback">{errors.transaction_type?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Transaction method </label>
                            <select name='transaction_method' className={`form-control selectlokacija ${errors.transaction_method ? 'is-touched' : ''}`}
                                {...register("transaction_method")}
                                onChange={(e) => { handleTransactionMethodChange(e.target.value); }} // Using setValue
                            >
                                <option value="">Select</option>
                                <option value="bank">Bank</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="bank_upi">Bank UPI</option>
                                <option value="credit_upi">Credit UPI</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="wallet">Wallet</option>
                            </select>
                            <div className="invalid-feedback">{errors.transaction_method?.message}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Payment Method</label>
                            <select name='transaction_sub_method' className={`form-control selectlokacija ${errors.transaction_sub_method ? 'is-invalid' : ''}`}
                                {...register("transaction_sub_method")}
                            >
                                <option value="">Select Type</option>
                                {Array.isArray(transactionSources.value) && transactionSources.value.map((source) => (
                                    <option key={source.id} value={source.id}>
                                        {source.name}
                                    </option>
                                ))}

                            </select>
                            <div className="invalid-feedback">{errors.transaction_source?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Source (Bank/Wallet/Card)</label>
                            <select name='transaction_source' className={`form-control selectlokacija ${errors.transaction_source ? 'is-invalid' : ''}`}
                                {...register("transaction_source")}
                            >
                                <option value="">Select Type</option>
                                {Array.isArray(source.value) && source.value.map((source) => (
                                    <option key={source.id} value={source.id}>
                                        {source.bank ? source.bank : source.name}
                                    </option>
                                ))}

                            </select>
                            <div className="invalid-feedback">{errors.transaction_source?.message}</div>
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Invoice</label>
                            {Array.isArray(invoice) && (
                                <Select
                                    {...register('invoice')}
                                    className={`form-control selectlokacija ${errors.invoice ? 'is-invalid' : ''}`}
                                    options={Array.isArray(invoice) ? invoice.map((source) => ({ value: source.id, label: source.id })) : null}
                                    value={selectedInvoice}
                                    onChange={handleChange}
                                    placeholder="Select Type or type to search..."
                                    isClearable
                                    isSearchable
                                />
                            )}
                            <div className="invalid-feedback">{errors.invoice?.message}</div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="mb-3 col">
                            <label className="form-label">Description</label>
                            <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.description?.message}</div>
                        </div>
                        <div className="mb-1 col-2">
                            <label className="form-label">Amount</label>
                            <input name="amount" type="number" {...register('amount')} className={`form-control ${errors.amount ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.amount?.message}</div>
                        </div>
                        <div className="mb-2 col-3">
                            <label className="form-label">
                                Transaction Date
                            </label>
                            <input
                                type="date"
                                id="transaction_date"
                                name="transaction_date"
                                pattern="\d{4}-\d{2}-\d{2}"
                                placeholder="YYYY-MM-DD"
                                {...register('transaction_date')}
                                className={` datepicker form-control ${errors.transaction_date ? 'is-invalid' : ''
                                    }`}
                            />
                            <div className="invalid-feedback">{errors.transaction_date?.message}</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/transactions" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {user?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {user?.error &&
                <div className="text-center m-5">
                    <div className="text-danger">Error loading user: {user.error}</div>
                </div>
            }
            </span>}
        </>
    );
}
