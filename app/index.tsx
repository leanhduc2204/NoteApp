import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getNotes, saveNotes } from '../utils/storage';
import { Note } from '../types/Note';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await getNotes();
      setNotes(savedNotes);
    };
    loadNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      Alert.alert('Lỗi', 'Nội dung ghi chú không được để trống.');
      return;
    }

    const newNoteObj: Note = {
      id: Date.now().toString(),
      title: newNote,
      content: '',
      createdAt: new Date(),
    };

    const updatedNotes = [newNoteObj, ...notes];
    setNotes(updatedNotes);
    setNewNote('');
    await saveNotes(updatedNotes);
  };

  const handleDeleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm ghi chú..."
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />

      <TextInput
        style={styles.input}
        placeholder="Thêm ghi chú mới..."
        value={newNote}
        onChangeText={setNewNote}
        onSubmitEditing={handleAddNote}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
              <Text style={styles.deleteButton}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteTitle: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});
