import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/Note';

const NOTES_STORAGE_KEY = 'NOTES';

export const saveNotes = async (notes: Note[]): Promise<void> => {
  const jsonValue = JSON.stringify(notes);
  await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
};

export const getNotes = async (): Promise<Note[]> => {
  const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};
