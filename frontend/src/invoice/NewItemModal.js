import React, { useState } from 'react';

const NewItemModal = ({ onSubmit, onClose, error, optionsSelect }) => {
  console.log(error)
  const [formData, setFormData] = useState({
    // Initialize form fields here
    name: '',
    description: '',
    // Add more fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass form data to parent component
    // You can add validation logic here before submitting
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{optionsSelect?"Add New Item for Selected Category":"Add Category"}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Form fields */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              {/* <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
              </div> */}
              {/* Add more form fields as needed */}
              <div>{error && ( <span className="text-danger" >The item {formData.name} already Exist</span>)}</div>
            </div>
           
            <div className="modal-footer">
            
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewItemModal;
