import React,  { useState }from 'react';
import { useSelector } from 'react-redux';

const TableRow = ({ index, control, register, errors, remove, handleChange, toggleModal, selectedCategory }) => {
  const invoiceOption = useSelector(state => state.invoiceOption?.listc) || [];
  const [selectedItem, setSelectedItem] = useState('');
  function transformErrorMessage(message) {
    // Example transformation: convert all characters to uppercase
    return message.replace(/invoice\[\d+\]\./, '').replace(/, but the.*/, "");
  }

  return (
    <tr>
      <td>
        <select 
          {...register(`invoice[${index}].item`)}
          className="form-control me-2"
          defaultValue={selectedItem}
          // value={selectedItem}
          key={selectedItem}
          onChange={(e) => {
            if (e.target.value === 'new') {
              toggleModal(); // Open modal if "Add New" option is selected
            }else{
              const selectedItem = e.target.value;
              setSelectedItem(selectedItem);
              handleChange(index, 'item', selectedItem);
            }
            
          }}
        >
          <option key='!' value=''>Select item</option>
          {Array.isArray(invoiceOption.value) && invoiceOption.value.map((source) => (
                                <option key={source.id} value={source.id}>
                                {source.name}
                                </option>
                            ))}
              {/* <option value="new">Add New</option> */}
        </select> 
        {errors?.invoice?.[index]?.item && (
          <span className="text-danger" style={{ textTransform: 'capitalize' }}>{errors.invoice[index].item.message}</span>
        )}
      </td>
      <td>
        <input
          {...register(`invoice[${index}].quantity`)}
          type="number"
          step="0.01"
          className="form-control"
          onBlur={(e) => handleChange(index,  'quantity', e.target.value )}
        />
        {errors?.invoice?.[index]?.quantity && (
          <span className="text-danger" style={{textTransform: 'capitalize'}}>{transformErrorMessage(errors.invoice[index].quantity.message)}</span>
        )}
      </td>
      <td>
        <input
          {...register(`invoice[${index}].price`)}
          type="number"
          step="0.01"
          className="form-control"
          onBlur={(e) => handleChange(index, 'price', e.target.value )}
        />
        {errors?.invoice?.[index]?.price && (
         <span className="text-danger" style={{textTransform: 'capitalize'}}>
         {transformErrorMessage(errors?.invoice?.[index]?.price?.message)}
       </span>
        )}
      </td>
      <td>
        <input
          {...register(`invoice[${index}].tax`)}
          type="number"
          step="0.01"
          className="form-control"
          onBlur={(e) => handleChange(index,  'tax', e.target.value )}
        />
        {errors?.invoice?.[index]?.tax && (
          <span className="text-danger" style={{textTransform: 'capitalize'}}>
          {errors?.invoice?.[index]?.tax && transformErrorMessage(errors.invoice[index].tax.message)}
        </span>
        )}
      </td>
      <td>
        {/* Display the calculated final price */}
        <input
          {...register(`invoice[${index}].final_price`)}
          type="number"
          step="0.01"
          className="form-control"
          onBlur={(e) => {handleChange(index, 'final_price', e.target.value )}}
        />
        {errors?.invoice?.[index]?.final_price && (
          <span className="text-danger" style={{textTransform: 'capitalize'}}>{transformErrorMessage(errors.invoice[index].final_price.message)}</span>
        )}
      </td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => remove(index)}
        >
          -
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
