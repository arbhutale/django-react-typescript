import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TableRow from './TableRows';
import NewItemModal from './NewItemModal';
import { useSelector, useDispatch } from 'react-redux';
import { invoiceUserActions, invoiceActions, alertActions, invoiceOptionActions } from '../_store';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { history } from '../_helpers';
import { useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  invoice: Yup.array().of(
    Yup.object().shape({
      item: Yup.string().required('Please Select Item'),
      quantity: Yup.number()
        .required('Quantity is required'),
      price: Yup.number().required('Price is required'),
      final_price: Yup.number().required('Price is required'),
      tax: Yup.number().moreThan(-1, 'Tax must be non-negative').nullable(),
    })
  ),
  user: Yup.string().required('Please Select User'),
  category: Yup.string().required('Please Select Category'),
  invoice_date: Yup.date()
    .required('Date of Transaction is required')
});

const AddEdit = () => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useDispatch();
  const invoiceUser = useSelector(state => state.invoiceUser?.list) || [];
  const invoiceOption = useSelector(state => state.invoiceOption?.list) || [];
  const invoiceOptionc = useSelector(state => state.invoiceOption?.listc) || [];
  const invoiceData = useSelector(state => state.invoice?.item) || null;
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [appendData, setAppendData] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [optionsSelect, setOptionsSelect] = useState(true);
  const [errorOption, setErrorOption] = useState(false);
  const [title, setTitle] = useState('Add Invoice');
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice',
  });
  const [showModal, setShowModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const toggleModal = (value = true) => {
    setOptionsSelect(value)
    setShowModal(!showModal);
  };
  const { id } = useParams();
  useEffect(() => {
    dispatch(alertActions.clear());
    if (invoiceUser.length === 0) {

      dispatch(invoiceUserActions.getAll()).unwrap();
    }
    if (invoiceOption.length === 0) {

      dispatch(invoiceOptionActions.getAll()).unwrap();
      // setLoader(false)
    }
    let total = 0;
    fields.forEach((item) => {
      total += parseFloat(item.final_price) || 0;
    });
    setTotalAmount(total);
    if (invoiceData === null && id) {
      setTitle("Update Invoice")
      dispatch(invoiceActions.getById(id)).unwrap()
    }


    if ((fields.length === 0 && id && !appendData)) {
      appendOptionsToFields();
    }


  }, [fields, control.fields, invoiceData]);
  const appendOptionsToFields = () => {
    if (invoiceData?.value) {
      dispatch(invoiceOptionActions.getByCategory(invoiceData?.value.category)).unwrap()
      setOptionsLoaded(true)
      setSelectedCategory(invoiceData?.value.category);
      setValue('category', invoiceData?.value.category);
      setSelectedUser(invoiceData?.value.user);
      setValue('user', invoiceData?.value.user);
      let date = new Date(invoiceData?.value.invoice_date);
      setValue('invoice_date', convertToDateTimeLocalString(date));
      setValue('description', invoiceData?.value.description);
      setAppendData(true)
    }
  };
  const convertToDateTimeLocalString = (date) => {
    console.log(date)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    let data = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    console.log(data)
    return data
  }
  useEffect(() => {
    if (optionsLoaded) {
      setTimeout(() => {
        reset({
          invoice: []
        })
        setValue('category', selectedCategory);
        setValue('user', selectedUser)
        invoiceData.value.items.forEach((item) => {
          append(item);
        });
      }, 1000);
    }
  }, [optionsLoaded])
  const formatterdate = (invoice_date_str) => {
    console.log(invoice_date_str)
    // Format the date components
    let datePart = new Date(invoice_date_str).toString()
    return datePart.split(" (")[0];

  }
  const onSubmit = async (data) => {
    dispatch(alertActions.clear());
    if (data.invoice.length === 0) {
      dispatch(alertActions.error("Please Add Alteat one item in Invoice"));
      return
    }
    // const formData2= formDataBuild(data)
    try {
      // Dispatch action with FormData
      if (id) {
        await dispatch(invoiceActions.update({ id, data, totalAmount })).unwrap();
      } else {
        await dispatch(invoiceActions.register(formDataBuild(data))).unwrap();
      }
      history.navigate('/invoice');
      dispatch(alertActions.success({ message: id ? 'Invoice Updated' : 'Invoice Added', showAfterRedirect: true }));
    } catch (error) {
      dispatch(alertActions.error("Please Submit valid Data or Image is Required"));
    }
  };

  const formDataBuild = (newData) => {

    var formData1 = new FormData();

    // Append image file to FormData
    // Assuming only one image is selected
    // Append other form data fields
    // formData1.append(...data)
    formData1.append('items', JSON.stringify(newData.invoice));
    // formData1.append('total_amount', totalAmount);
    formData1.append('invoice_user', newData.user);
    formData1.append('description', newData.description);
    formData1.append('category', selectedCategory)
    formData1.append('total_amount', totalAmount)
    if (newData.image[0]) {
      formData1.append('image', newData.image[0]);
    }
    formData1.append('invoice_date', formatterdate(newData.invoice_date))

    return formData1
  }
  const handleNewItemSubmit = async (formData) => {
    // After handling submission, you can close the modal if needed
    if (optionsSelect) {


      formData.category = selectedCategory
      try {
        await dispatch(invoiceOptionActions.register(formData)).unwrap();
        setErrorOption(false)
        setShowModal(false);
        dispatch(invoiceOptionActions.getByCategory(selectedCategory)).unwrap()
      } catch (error) {
        setErrorOption(true)
        dispatch(alertActions.error("The item might be already exist or Server down"));
      }
    } else {
      try {
        await dispatch(invoiceOptionActions.registerCategory(formData)).unwrap();
        setErrorOption(false)
        setShowModal(false);
        dispatch(invoiceOptionActions.getAll()).unwrap()
      } catch (error) {
        setErrorOption(true)
        dispatch(alertActions.error("The item might be already exist or Server down"));
      }
    }



  };
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setValue('user', e.target.value);
  };

  const confirmCategoryChange = (e) => {
    const confirmed = window.confirm('Will Delete all the Invoice Items! Are you sure you want to change the category?');
    if (confirmed) {
      reset({
        invoice: []
      })
      setSelectedCategory(e.target.value);
      setValue('category', setSelectedCategory);
      setIsChangingCategory(false);
      dispatch(invoiceOptionActions.getByCategory(e.target.value)).unwrap()

    }
  };
  const handleCategoryChange = (e) => {
    if (!isChangingCategory && fields.length !== 0) {
      setIsChangingCategory(true);
      confirmCategoryChange(e);
    } else {
      // reset()
      dispatch(invoiceOptionActions.getByCategory(e.target.value)).unwrap()
      setSelectedCategory(e.target.value);
      setValue('category', setSelectedCategory);
      setIsChangingCategory(false);
    }
  };
  const calculatefinal_price = (index, data) => {
    const quantity = parseFloat(data.quantity) || 0;
    const price = parseFloat(data.price) || 0;
    const tax = parseFloat(data.tax) || 0;

    // Calculate the final price
    const final_price = quantity * price + tax;

    // Update the form data with the calculated final price
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], final_price: final_price };
    setValue('invoice', updatedFields);
  };

  const handleChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;

    // Trigger a re-render of the form with the updated data
    setValue('invoice', updatedFields);

    // Calculate the final price using the updated data
    calculatefinal_price(index, updatedFields[index]);
  };
  const handleImageChange = (e) => {
    // Handle changes to the invoice image input
    // For simplicity, you can just set the value to the form data
    setValue('image', e.target.files[0]);
  };
  const tooltip = <Tooltip id="tooltip">{!selectedCategory ? "Please Select Category to Enable" : "Add New Row"}</Tooltip>;
  return (
    <div className="container">
      <h3>{title}</h3>
      {/* <pre>{invoiceData?invoiceData:""}</pre> */}
      {!Array.isArray(invoiceUser.value)?<div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>:
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='row'>
          <div className="col">
            <label htmlFor="userSelect" className="form-label">Select User:</label>
            <select id="userSelect" className="form-control" value={selectedUser} onChange={handleUserChange}>
              <option value="">Select user</option>
              {Array.isArray(invoiceUser.value) && invoiceUser.value.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
            {errors?.user && (
              <span className="text-danger" style={{ textTransform: 'capitalize' }}>{errors.user.message}</span>
            )}
          </div>
          <div className='col'>
            <label htmlFor="category" className="form-label">Select Category:</label>
            <div style={{ display: "flex" }}>
              <select style={{ marginRight: "5px" }} id="category" className="form-control" value={selectedCategory} onChange={handleCategoryChange} >
                {/* <option value="">Select user</option> */}
                <option value="">Select category</option>
                {Array.isArray(invoiceOption.value) && invoiceOption.value.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
              <div onClick={() => toggleModal(false)} className='btn btn-outline-success'>+</div>
              {errors?.category && (
                <span className="text-danger" style={{ textTransform: 'capitalize' }}>{errors.category.message}</span>
              )}
            </div>
          </div>
          <div className='col'>
            <label className="form-label">
              Transaction Date
            </label>
            <input
              type="datetime-local"
              id="invoice_date"
              name="invoice_date"
              // pattern="\d{4}-\d{2}-\d{2}"
              // placeholder="YYYY-MM-DD"
              // value={invoiceDate}
              {...register('invoice_date')}
              className={` datepicker form-control ${errors.invoice_date ? 'is-invalid' : ''
                }`}
            />
            <div className="invalid-feedback">{errors.invoice_date?.message}</div>
          </div>
        </div>
        <br />
        <div className="row ">
          <div className='table-responsive-sm'>
          { !invoiceData.value? <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>:
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Item(Sub Category) <div onClick={() => toggleModal()} style={{ "padding": "0px", paddingLeft: "6px", paddingRight: "6px" }} className='btn btn-outline-success'>+</div></th>
                  <th style={{ width: '20%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Price</th>
                  <th style={{ width: '20%' }}>Tax (<small> Include in price </small>)</th>
                  <th style={{ width: '15%' }}>Final Price</th>
                  <th style={{ width: '10%' }}>
                    <OverlayTrigger placement="top" overlay={tooltip}>
                      <span className="d-inline-block">
                        <Button
                          type="button"
                          variant="outline-success"
                          onClick={() => append({})}
                          disabled={!selectedCategory}
                        >
                          +
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </th>
                </tr>

              </thead>
              
              <tbody className='pb-3'>
              
                {fields.map((item, index) => (
                  <TableRow
                    key={item.id}
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    remove={remove}
                    handleChange={handleChange}
                    toggleModal={toggleModal}
                    selectedCategory={selectedCategory}
                  />
                ))}
              </tbody>
                
                
            </table>
          }
          </div>
        </div>
        <div className="row">
          {/* Additional fields or components can be added here */}
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className='col-3'>
                <label className="form-label">Invoice Copy:</label>
              </div>
              <div className='col-6'>
                <input
                  id="imageInput"
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  {...register('image')} // Register the image field with react-hook-form
                />
                {errors?.image && (
                  <span className="text-danger" style={{ textTransform: 'capitalize' }}>{errors.image.message}</span>
                )}

              </div>
              <div className='col-3'>
                {id && (
                  <a href={process.env.REACT_APP_API_URL + invoiceData?.value?.image} target='_blank' rel="noreferrer"> <span type='info' className='btn btn-sm btn-info'>View Invoice</span></a>
                )}
              </div>
            </div>
          </div>
          <div className='float-end me-md-3 col'>
            {/* Additional fields or components can be added here */}
          </div>
          <div className='col-3'>
            Total Amount: {totalAmount}
          </div>
        </div>
        <br />
        <div className='col'>
          <label htmlFor="w3review">Description:</label>

          <textarea {...register('description')} className="form-control" id="exampleFormControlTextarea1" rows="3">

          </textarea>
        </div>
        <br />
        <div className="row">
          <button type="submit" className="btn btn-primary me-2">
            {id ? "Update" : "Save"}
          </button>
        </div>

      </form>
      }
      {showModal && <NewItemModal onSubmit={handleNewItemSubmit} onClose={toggleModal} error={errorOption} optionsSelect={optionsSelect} />}
    </div>
  );
};

export { AddEdit };
