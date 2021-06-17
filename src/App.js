import './App.css';
import React, {useState, useEffect} from "react";
import List from "./components/List";
import Alert from "./components/Alert"

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIdEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: false, msg: "", type: ""});

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please enter Something!");
    } else if (name && isEditing){
      setList(
          list.map((item) => {
            if (item.id === editID){
              return {...item, title: name}
            }
            return item
          })
      );
      setName();
      setEditID(null);
      setIdEditing(false);
      showAlert(true, "success", "Item changed successfully!");
    } else {
      showAlert(true, "success", "Item added successfully!");
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg })
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "Item removed successfully!");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const editItem = list.find((item) => item.id ===id);
    setIdEditing(true);
    setEditID(id);
    setName(editItem.title);
  };

  const clearList = () => {
    showAlert(true, "danger", "List was cleared successfully!");
    setList([]);
  };
  
  return (
      <section className="section-center">
        <form onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
          <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>ToDoListApp!!</h3>
          <div className="mb-3 form">
            <input type="text" placeholder="eg. Wake up!" style={{ borderRadius: 0 }} onChange={(e) => setName(e.target.value)} value={name} className="form-control"/>
            <button type="submit" className="btn btn-success" style={{ borderRadius: 0 }}>
              {isEditing ? "Edit" : "Submit"}
            </button>
            <button className="btn btn-warning" style={{ borderRadius: 0, width: 160 }} onClick={clearList}>Clear Items</button>
          </div>
        </form>
        <hr></hr>
        {list.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <List items={list} removeItem={removeItem} editItem={editItem} />
            </div>
        )}
      </section>
  )
}

export default App;
