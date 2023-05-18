import React, { useState,useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Dropzone from "react-dropzone";

const CreateProduct = (props) => {
  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [productVariantPrices, setProductVariantPrices] = useState([]);

  const [productVariants, setProductVariant] = useState([
    {
      option: 1,
      tags: [],
    },
  ]);
  

  const [images, setImages] = useState([]);
  // console.log(typeof props.variants)
  // handle click event of the Add button
  const handleAddClick = () => {
    let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(
      (el) => el.id
    );
    let selected_variants = productVariants.map((el) => el.option);
    let available_variants = all_variants.filter(
      (entry1) => !selected_variants.some((entry2) => entry1 == entry2)
    );
    setProductVariant([
      ...productVariants,
      {
        option: available_variants[0],
        tags: [],
      },
    ]);
  };

  // handle input change on tag input
  const handleInputTagOnChange = (value, index) => {
    let product_variants = [...productVariants];
    product_variants[index].tags = value;
    setProductVariant(product_variants);
    document.getElementById("variant_error").innerHTML=null
     checkVariant();
  };

  // remove product variant
  const removeProductVariant = (index) => {
    let product_variants = [...productVariants];
    product_variants.splice(index, 1);
    setProductVariant(product_variants);
  };

  // check the variant and render all the combination
  const checkVariant = () => {
    let tags = [];

    productVariants.filter((item) => {
      tags.push(item.tags);
    });

    setProductVariantPrices([]);

    getCombn(tags).forEach((item) => {
      setProductVariantPrices((productVariantPrice) => [
        ...productVariantPrice,
        {
          title: item,
          price: 0,
          stock: 0,
        },
      ]);
    });
  };

  // combination algorithm
  function getCombn(arr, pre) {
    pre = pre || "";
    if (!arr.length) {
      return pre;
    }
    let ans = arr[0].reduce(function (ans, value) {
      return ans.concat(getCombn(arr.slice(1), pre + value + "/"));
    }, []);
    return ans;
  }

  //  console.log(images)


   
  
  useEffect(() => {
    // Update the document title using the browser API
    document.getElementById("sku_error").innerHTML=null 

  },[productSku]);
   
  // Save product
  let saveProduct = (event) => {
    event.preventDefault();
    let spinner=`
    <div class="spinner-border" role="status">
    <span class="visually-hidden"></span>
  </div>`
  
    document.getElementById("saveBtn").innerHTML=spinner
    const csrfToken = document.querySelector(
      "input[name='csrfmiddlewaretoken']"
    ).value;
     
    let variantList = [];
    let price = document.getElementsByClassName("price");
    let stock = document.getElementsByClassName("stock");
    let variant = document.getElementsByClassName("variant");
    // console.log(image_list);
    let tag = document.getElementsByClassName("react-tagsinput-input").value; 
    
    for (let i = 0; i < price.length; i++) {
      variantList.push({
        variant: variant[i].textContent,
        price: price[i].value,
        stock: stock[i].value,
      });
    }
    // TODO : write your code here to save the product
    
    let data = {
      title: productName,
      sku: productSku,
      description: productDescription,
      variant: variantList,
      images: images,
    };

    fetch("/product/create-product/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Specify the content type as JSON
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.msg=="product has been successfully created"){
            location.href="/product/list/"
        }
        // Handle the response data
        
         if(data.errors.sku){
             document.getElementById("sku_error").innerHTML=data.errors.sku
        }
        if(data.errors.non_field_errors=="Varient field is required"){
            document.getElementById("variant_error").innerHTML="Variant field is required"
        }else if(data.errors.non_field_errors){
            document.getElementById("variant_error").innerHTML=data.errors.non_field_errors
        }
        setTimeout(() => {
          document.getElementById("saveBtn").innerHTML="Save"
        }, 1000);
        
      })
      .catch((error) => {
       
      });
  };

  return (
    <div>
      <form action="" onSubmit={(e) => saveProduct(e)}>
        <section>
          <div className="row">
            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="">Product Name</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      onChange={(e) => setProductName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Product SKU</label>
                    <input
                      type="text"
                      placeholder="Product SKU"
                      onChange={(e) => setProductSku(e.target.value)}
                      className="form-control"
                      required
                    />
                    <p id="sku_error" style={{color:"red"}}></p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Description</label>
                    <textarea
                      id=""
                      cols="30"
                      rows="4"
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="form-control"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Media</h6>
                </div>
                <div className="card-body border">
                  <Dropzone
                    onDrop={(acceptedFiles) => setImages(acceptedFiles)}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Variants
                  </h6>
                 
                </div>
                <div className="card-body">
                <p id="variant_error" style={{color:"red"}}></p>
                  {productVariants.map((element, index) => {
                    return (
                      <div className="row" key={index}>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="">Option</label>
                            <select
                              className="form-control"
                              defaultValue={element.option}
                            >
                              {JSON.parse(
                                props.variants.replaceAll("'", '"')
                              ).map((variant, index) => {
                                return (
                                  <option key={index} value={variant.id}>
                                    {variant.title}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-8">
                          <div className="form-group">
                            {productVariants.length > 1 ? (
                              <label
                                htmlFor=""
                                className="float-right text-primary"
                                style={{ marginTop: "-30px" }}
                                onClick={() => removeProductVariant(index)}
                              >
                                remove
                              </label>
                            ) : (
                              ""
                            )}

                            <section style={{ marginTop: "30px" }}>
                              <TagsInput
                               
                                value={element.tags}
                                style="margin-top:30px"
                                onChange={(value) =>
                                  handleInputTagOnChange(value, index)
                                }
                              />
                            </section>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card-footer">
                  {productVariants.length !== 3 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddClick}
                    >
                      Add another option
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                <div className="card-header text-uppercase">Preview</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <td>Variant</td>
                          <td>Price</td>
                          <td>Stock</td>
                        </tr>
                      </thead>
                      <tbody>
                        {productVariantPrices.map(
                          (productVariantPrice, index) => {
                            return (
                              <tr key={index}>
                                <td className="variant">
                                  {productVariantPrice.title}
                                </td>
                                <td>
                                  <input
                                    className="form-control price"
                                    type="number"
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control stock"
                                    type="number"
                                    required
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-lg btn-primary" id="saveBtn">
            Save
           
          </button>
          <button type="button" className="btn btn-secondary btn-lg " id="cancelBtn">
            Cancel
          </button>
        </section>
      </form>
    </div>
  );
};

export default CreateProduct;
