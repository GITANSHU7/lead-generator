import axios from "axios";
import {
    Button,
    Label,
    Modal,
    Pagination,
    Table,
    TextInput
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

const Lead = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [leadIdToDelete, setLeadIdToDelete] = useState(null);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newLead, setNewLead] = useState([
    {
      name: "",
      email: "",
      number: "",
      products: [{ productName: "", quantity: "", price: "" }],
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadLead = async () => {
    try {
      const apiToken = user?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post(
        "https://authenticator-server.vercel.app/lead/list",
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      setLoading(false);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching lead details");
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadLead();
      } catch (error) {
        console.error(error?.message || "Error in authentication check");
      }
    };

    checkAuth();
  }, []);

  const deleteLead = async () => {
    if (!leadIdToDelete) return;

    try {
      
      const apiToken = user?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.delete(
        `https://authenticator-server.vercel.app/lead/delete/${leadIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      await loadLead();
      toast.success("Lead deleted successfully");
      setDeleteModalOpen(false);
      setLeadIdToDelete(null);
    } catch (error) {
      console.error(error.message || "Error deleting lead");
      toast.error("Failed to delete lead");
    }
  };

  const editLead = async () => {
    if (!leadToEdit) return;

    try {
     
      const apiToken = user?.data?.token

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.put(
        `https://authenticator-server.vercel.app/lead/update/${leadToEdit._id}`,
        leadToEdit,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      await loadLead();
      toast.success("Lead updated successfully");
      setEditModalOpen(false);
      setLeadToEdit(null);
    } catch (error) {
      console.error(error.message || "Error updating lead");
      toast.error("Failed to update lead");
    }
  };

  const createLead = async (data) => {
    try {
      const apiToken = user?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post(
        "https://authenticator-server.vercel.app/lead/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      console.log(data);

      await loadLead(); // Refresh the lead list after creation
      toast.success("Lead created successfully");
      setCreateModalOpen(false); // Close the modal
      reset(); // Reset the form fields
    } catch (error) {
      console.error(error.message || "Error creating lead");
      toast.error("Failed to create lead");
    }
  };

//   const createLead = async () => {
//     try {
     
//       const apiToken = user?.data?.token;

//       if (!apiToken) {
//         throw new Error("Missing authorization token");
//       }

//       const response = await axios.post(`https://authenticator-server.vercel.app/lead/create`, data, {
//         headers: {
//           Authorization: `Bearer ${apiToken}`,
//         },
//       });
//       await loadLead();
//       toast.success("Lead created successfully");
//       setCreateModalOpen(false);
//     //   setNewLead({  name: "",
//     //     email: "",
//     //     number: "",
//     //     products: [{ productName: "", quantity: 0, price: "" }] });
//     } catch (error) {
//       console.error(error.message || "Error creating lead");
//       toast.error("Failed to create lead");
//     }
//   };
  const handleProductChangeEdit = (index, field, value) => {
    const updatedProducts = leadToEdit.products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setLeadToEdit({ ...leadToEdit, products: updatedProducts });
  };
  const handleProductChangeAdd = (index, field, value) => {
    const updatedProducts = setNewLead.products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setNewLead({ ...setNewLead, products: updatedProducts });
  };

  // Get current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = data.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const serialNumber = indexOfFirstItem + 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

   // Handle delete button click
   const handleDeleteClick = (id) => {
    setLeadIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (lead) => {
    setLeadToEdit(lead);
    setEditModalOpen(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

    // Add a new product field
    const addProductForEdit = () => {
        const newProduct = {
          productName: "",
          quantity: 0,
          price: 0,
        //   _id: Date.now().toString(), // unique id for new products
        };
        setLeadToEdit({ ...leadToEdit, products: [...leadToEdit.products, newProduct] });
      };
    
      // Remove a product field
      const deleteProductForEdit = (index) => {
        const updatedProducts = leadToEdit.products.filter((_, i) => i !== index);
        setLeadToEdit({ ...leadToEdit, products: updatedProducts });
      };
    
      const handleProductChange = (index, field, value) => {
        const updatedProducts = [...newLead.products];
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]: value,
        };
        setNewLead({ ...newLead, products: updatedProducts });
      };
    
      const addProductForCreate = () => {
        setNewLead({
          ...newLead,
          products: [...newLead.products, { productName: "d", quantity: 0, price: 0 }],
        });
      };
    
      const removeProduct = (index) => {
        const updatedProducts = newLead.products.filter((_, i) => i !== index);
        setNewLead({ ...newLead, products: updatedProducts });
      };
    
      //  for add product

      const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
        //   name: "",
        //   email: "",
        //   number: "",
          products: [{ productName: "", quantity: "", price: "" }],
        },
      });

      const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
      });
    
      const onSubmit = (data) => {
        createLead(data);
        setCreateModalOpen(false);
      };

  return (
    <>
     <div>
        <div className="p-4">
          <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white">
            Lead List
            <div className="float-right rtl:float-left">
            <div className="flex space-x-2 rtl:space-x-reverse">
                <Button color="gray" onClick={handleCreateClick}>
                  <HiPlusCircle className="mr-2 h-5 w-5" />
                 Add Lead
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    loadLead();
                    toast.success("Record Refreshed");
                  }}
                >
                  <IoIosRefreshCircle className="mr-2 h-5 w-5" />
                Refresh
                </Button>
             
            </div>
            </div>
          </h1>
          <div className="flex justify-end items-end mb-3">
            <TextInput
              placeholder={"Search"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <Table striped={true}>
              <Table.Head>
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>No of Products</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {loading
                  ? [...Array(itemsPerPage)].map((_, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : currentData.map((lead, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>{serialNumber + index}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </Table.Cell>
                        <Table.Cell>{lead.email}</Table.Cell>
                        <Table.Cell>{lead.number}</Table.Cell>
                        {/* <Table.Cell>{lead?.products?.map((a))}</Table.Cell> */}
                        <Table.Cell>{lead?.products?.length}</Table.Cell>
                        <Table.Cell className="flex flex-wrap gap-2">
                          <Button
                            color="blue"
                            pill
                            onClick={() => handleEditClick(lead)}
                            size={"sm"}
                          >
                            <FaEdit size={"sm"} className="mr-2 h-5 w-5" />
                           Edit
                          </Button>
                          <Button
                            color="failure"
                            pill
                            onClick={() => handleDeleteClick(lead._id)}
                            size={"sm"}
                          >
                            <RiDeleteBin6Fill
                              size={"sm"}
                              className="mr-2 h-5 w-5"
                            />
                          Delete
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
              </Table.Body>
            </Table>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
      </div>

      {/* Delete Lead Modal */}
      <Modal
        show={deleteModalOpen}
        size="md"
        onClose={() => setDeleteModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this lead?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteLead}>
              Yes
              </Button>
              <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        show={editModalOpen}
        size="2xl"
        onClose={() => setEditModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Edit Lead
            </h3>
            <div className="columns-3">
             
                <div className="">
                <Label htmlFor="name" value='Name' />
                <TextInput
                  id="name"
                  type="text"
                  value={leadToEdit?.name || ""}
                  onChange={(e) =>
                    setLeadToEdit({
                      ...leadToEdit,
                      name: e.target.value,
                    })
                  }
                />
              </div>
             
              <div>
                <Label htmlFor="email" value= "Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={leadToEdit?.email || ""}
                  onChange={(e) =>
                    leadToEdit({
                      ...leadToEdit,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="number" value="Number" />
                <TextInput
                  id="number"
                  type="number"
                  value={leadToEdit?.number || ""}
                  onChange={(e) =>
                    setLeadToEdit({
                      ...leadToEdit,
                      number: e.target.value,
                    })
                  }
                />
              </div>
              </div>
              <div className="border-t mt-4 pt-4">
                </div>
             
              {leadToEdit?.products?.map((product, index) => (
              <div key={product._id} className="">
                <div className="columns-3 mt-3">
                <div>
                  <Label htmlFor={`productName-${index}`} value={`Product Name ${index + 1}`} />
                  <TextInput
                    id={`productName-${index}`}
                    type="text"
                    value={product.productName || ""}
                    onChange={(e) =>
                      handleProductChangeEdit(index, "productName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${index}`} value="Quantity" />
                  <TextInput
                    id={`quantity-${index}`}
                    type="number"
                    value={product.quantity || ""}
                    onChange={(e) =>
                      handleProductChangeEdit(index, "quantity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${index}`} value="Price" />
                  <TextInput
                    id={`price-${index}`}
                    type="number"
                    step="0.01"
                    value={product.price || ""}
                    onChange={(e) =>
                      handleProductChangeEdit(index, "price", e.target.value)
                    }
                  />
                </div>
                
                {/* */}
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <div>
                <Button color="success" onClick={() => addProductForEdit(index)}>
                 Add
                </Button> 
                </div>
                    <div>
                <Button color="red" onClick={() => deleteProductForEdit(index)}>
                 Delete
                </Button> 
                </div>
                </div>
            </div>
             
            ))}
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={editLead}>
               Save
              </Button>
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
               Cancel
              </Button>
            </div>
          
        </Modal.Body>
      </Modal>

      {/* Create Lead Modal */}
      <Modal
        show={createModalOpen}
        size="2xl"
        onClose={() => setCreateModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          {/* <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Create Lead
            </h3>
            <div className="columns-3">
              <div>
                <Label htmlFor="newName" value="Name" />
                <TextInput
                  id="newName"
                  type="text"
                  value={newLead.name || ""}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newEmail" value="Email"/>
                <TextInput
                  id="newEmail"
                  type="email"
                  value={newLead.email || ""}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="number" value="number" />
                <TextInput
                  id="number"
                  type="number"
                  value={newLead.number || ""}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-start mt-4">
            <Button color="blue" onClick={addProductForCreate1}>
              Add Product
            </Button>
          </div>

          {newLead?.products?.map((product, index) => (
            <div key={index} className="flex gap-4 mt-4">
              <div>
                <Label htmlFor={`productName-${index}`} value="Product Name" />
                <TextInput
                  id={`productName-${index}`}
                  type="text"
                  value={product.productName || ""}
                  onChange={(e) =>
                    handleProductChange1(index, "productName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${index}`} value="Quantity" />
                <TextInput
                  id={`quantity-${index}`}
                  type="number"
                  value={product.quantity || ""}
                  onChange={(e) =>
                    handleProductChange1(index, "quantity", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`price-${index}`} value="Price" />
                <TextInput
                  id={`price-${index}`}
                  type="number"
                  value={product.price || ""}
                  onChange={(e) =>
                    handleProductChange1(index, "price", e.target.value)
                  }
                />
              </div>
              {index > 0 && ( // Hide the Remove button for the first product
                <Button color="red" onClick={() => removeProduct1(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}

            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={createLead}>
              Save
              </Button>
              <Button color="gray" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div> */}
           <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Create Lead
            </h3>
            <div className="columns-3">
              <div>
                <Label htmlFor="newName" value="Name" />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextInput id="newName" type="text" {...field} />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="newEmail" value="Email" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput id="newEmail" type="email" {...field} />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="number" value="Number" />
                <Controller
                  name="number"
                  control={control}
                  render={({ field }) => (
                    <TextInput id="number" type="number" {...field} />
                  )}
                />
              </div>
            </div>
           

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mt-4">
                <div>
                  <Label htmlFor={`productName-${index}`} value="Product Name" />
                  <Controller
                    name={`products.${index}.productName`}
                    control={control}
                    render={({ field }) => (
                      <TextInput id={`productName-${index}`} type="text" {...field} />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${index}`} value="Quantity" />
                  <Controller
                    name={`products.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextInput id={`quantity-${index}`} type="number" {...field} />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${index}`} value="Price" />
                  <Controller
                    name={`products.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <TextInput id={`price-${index}`} type="number" {...field} />
                    )}
                  />
                </div>
                {index > 0 && (
                  <Button color="red" size={'sm'} onClick={() => remove(index)}>
                    X
                  </Button>
             
                )}
              </div>
            ))}
             <div className="flex justify-end mt-4">
              <Button
                color="blue"
                onClick={() => append({ productName: "", quantity: "", price: "" })}
              >
                Add Product
              </Button>
            </div>
 <div className="flex justify-center gap-4 mt-4">
              <Button color="success" type="submit">
                Save
              </Button>
              <Button color="gray" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Lead;
