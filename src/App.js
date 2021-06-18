import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { API, Storage } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listNotes, listProducts } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  createProduct as createProductMutation,
  deleteProduct as deleteProductMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "", price: "", stock: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // fetchNotes();
    fetchProducts();
  }, []);
  // async function fetchNotes() {
  //   const apiData = await API.graphql({ query: listNotes });
  //   const notesFromAPI = apiData.data.listNotes.items;
  //   await Promise.all(
  //     notesFromAPI.map(async (note) => {
  //       if (note.image) {
  //         const image = await Storage.get(note.image);
  //         note.image = image;
  //       }
  //       return note;
  //     })
  //   );
  //   setNotes(apiData.data.listNotes.items);
  // }
  async function fetchProducts() {
    const apiData = await API.graphql({ query: listProducts });
    const productsFromAPI = apiData.data.listProducts.items;
    await Promise.all(
      productsFromAPI.map(async (product) => {
        if (product.image) {
          const image = await Storage.get(product.image);
          product.image = image;
        }
        return product;
      })
    );
    setProducts(apiData.data.listProducts.items);
  }
  // async function createNote() {
  //   if (!formData.name || !formData.description) return;
  //   await API.graphql({
  //     query: createNoteMutation,
  //     variables: { input: formData },
  //   });
  //   if (formData.image) {
  //     const image = await Storage.get(formData.image);
  //     formData.image = image;
  //   }

  //   setNotes([...notes, formData]);
  //   setFormData(initialFormState);
  // }
  async function createProduct() {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock
    )
      return;
    await API.graphql({
      query: createProductMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    // if (formData.price) {
    //   const price = await Storage.get(formData.price);
    //   formData.price = price;
    // }
    // if (formData.stock) {
    //   const stock = await Storage.get(formData.stock);
    //   formData.stock = stock;
    // }

    setProducts([...products, formData]);
    setFormData(initialFormState);
  }

  // async function deleteNote({ id }) {
  //   const newNotesArray = notes.filter((note) => note.id !== id);
  //   setNotes(newNotesArray);
  //   await API.graphql({
  //     query: deleteNoteMutation,
  //     variables: { input: { id } },
  //   });
  // }
  async function deleteProduct({ id }) {
    const newProductArray = products.filter((product) => product.id !== id);
    setProducts(newProductArray);
    await API.graphql({
      query: deleteProductMutation,
      variables: { input: { id } },
    });
  }
  // async function onChange(e) {
  //   if (!e.target.files[0]) return;
  //   const file = e.target.files[0];
  //   setFormData({ ...formData, image: file.name });
  //   await Storage.put(file.name, file);
  //   fetchNotes();
  // }
  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchProducts();
  }
  return (
    <div className="App">
      <h1>Register Product</h1>
      {/* <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Note description"
        value={formData.description}
      />
      <input type="file" onChange={onChange} />
      <button onClick={createNote}>Create Note</button> */}
      <hr />
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Product Name"
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Product description"
        value={formData.description}
      />
      <input
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Product price"
        value={formData.price}
      />
      <input
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        placeholder="Product stock"
        value={formData.stock}
      />
      <input type="file" onChange={onChange} />
      <button onClick={createProduct}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {/* {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete note</button>
            {note.image && <img src={note.image} style={{ width: 400 }} />}
          </div>
        ))} */}

        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name} </h2>
            <p>{product.price}</p>
            <p>{product.stock ? "stock" : "out of stock"}</p>
            <button onClick={() => deleteProduct(product)}>Delete product</button>
            {product.image && (
              <img src={product.image} style={{ width: 400 }} />
            )}
          </li>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
