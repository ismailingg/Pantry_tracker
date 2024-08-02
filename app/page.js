'use client'
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Container } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "pantryItems"));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInventory(items);
  };

  const addItem = async () => {
    if (itemName.trim() === '') return;

    // Check if the item already exists
    const existingItem = inventory.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (existingItem) {
      const itemDoc = doc(db, "pantryItems", existingItem.id);
      await updateDoc(itemDoc, { count: existingItem.count + 1 });
      setInventory(inventory.map(item => (item.id === existingItem.id ? { ...item, count: item.count + 1 } : item)));
    } else {
      const docRef = await addDoc(collection(db, "pantryItems"), { name: itemName, count: 1 });
      setInventory([...inventory, { id: docRef.id, name: itemName, count: 1 }]);
    }
    setItemName('');
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "pantryItems", id));
    setInventory(inventory.filter(item => item.id !== id));
  };

  const editItem = (id, name) => {
    setEditId(id);
    setItemName(name);
  };

  const filteredItems = inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Pantry Management
        </Typography>
      </Box>
      <Box component={Paper} sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={addItem}
        >
          {editId ? 'Update Item' : 'Add Item'}
        </Button>
      </Box>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List component={Paper} sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {filteredItems.map(item => (
          <ListItem
            key={item.id}
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    mr: 1
                  }}
                >
                  <Typography variant="body2">{item.count}</Typography>
                </Box>
                <IconButton edge="end" aria-label="edit" onClick={() => editItem(item.id, item.name)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
