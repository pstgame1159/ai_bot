import React, { useState, useRef }   from "react";
import "./css/Modal.css";
import photo from '../asset/photo.png';
import { useAuth } from './AuthContext';
import axios from "axios";
import Swal from 'sweetalert2';
export default function Modal() {
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const { customer_id, ports, portsuser, sumcommission_all, sumcommission } = useAuth();



  const toggleModal = () => {
    setModal(!modal);
  };
  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  




  const [file, setFile] = useState(null);


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://139.59.237.69:8002/api/v1/detect-slip', formData)
      .then((response) => {
        // if( response.data.data.toAccountName != "น.ส. เจนจิรา กลั่นฉวี")
        // {
        //   alert("ปลายทางไม่ถูกต้อง")
        //   return
        // }
        const referenceNo = response.data.data.referenceNo
        const fromAccountName = response.data.data.fromAccountName
        const bankname = response.data.data.fromBankName    
        const amount = response.data.data.amount       
        console.log(response)
        axios.post(`${process.env.REACT_APP_NAME_URL}/upload`,formData)
        .then(res =>{  
          const filename = res.data.filename
        axios.post(`${process.env.REACT_APP_NAME_URL}/sendslip`,{customer_id,referenceNo,fromAccountName,bankname,amount,filename})
        .then(res =>{  
          if(res.data.code == "ER_DUP_ENTRY")
          {
            Swal.fire({
              title: "ERROR!",
              text: "Your slip has already been used.!",
              icon: "error"
            });
            return 
          }
          else if(res.data.status == "Success" )
         axios.put(`${process.env.REACT_APP_NAME_URL}/updatecustomers`,{customer_id,amount})
        .then(res =>{  
          Swal.fire({
            title: "Top up successfully!",
            text: "Total ENTRY  ="+res.data.amout,
            icon: "success"
          });
        }).catch(err=> {console.log(err)});

        }).catch(err=> {console.log(err)});
      }).catch(err=> {console.log(err)});
        
        
      })
      .catch((error) => {
        console.error('Error uploading file: ', error);
        alert("Error uploading file")
      });
  };















  








  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;
    setFile(event.target.files[0])
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            // console.log(file);
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };


  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };




  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        UPLOAD   Slip
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div className="image-upload-container">

              <div className="box-decoration">
                <label htmlFor="image-upload-input" className="image-upload-label">
                  {image ? image.name : "Choose an image"}
                </label>
                <div onClick={handleClick} style={{ cursor: "pointer" }}>
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="upload image" className="img-display-after" />
                  ) : (
                    <img src={photo} alt="upload image" className="img-display-before" />
                  )}

                  <input
                    id="image-upload-input"
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </div>
                <button className="image-upload-button" onClick={handleSubmit}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </>
  );
}