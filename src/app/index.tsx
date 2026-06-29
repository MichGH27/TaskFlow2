import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/gemini';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // READ
  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });

    console.log('FETCH:', data);
    console.log('FETCH ERROR:', error);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setTasks(data || []);
  }

  // CREATE
  async function handleAddTask() {
    if (!task.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: task.trim(),
          completed: false,
        },
      ])
      .select();

    console.log('INSERT:', data);
    console.log('INSERT ERROR:', error);

    if (error) {
      Alert.alert('Insert Error', error.message);
      return;
    }

    setTask('');
    fetchTasks();
  }

  // UPDATE
  async function handleToggleTask(
    id: number,
    completed: boolean
  ) {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed: !completed,
      })
      .eq('id', id);

    if (error) {
      Alert.alert('Update Error', error.message);
      return;
    }

    fetchTasks();
  }

  // DELETE
  async function handleDeleteTask(id: number) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Delete Error', error.message);
      return;
    }

    fetchTasks();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
        >
          <MaterialIcons
            name="add"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.map((item) => (
          <View
            key={item.id}
            style={styles.taskRow}
          >
            <TouchableOpacity
              onPress={() =>
                handleToggleTask(
                  item.id,
                  item.completed
                )
              }
            >
              <MaterialIcons
                name={
                  item.completed
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={24}
                color={
                  item.completed
                    ? '#2E5BBA'
                    : '#5A6472'
                }
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.taskText,
                item.completed &&
                  styles.completedTask,
              ]}
            >
              {item.title}
            </Text>

            <TouchableOpacity
              onPress={() =>
                handleDeleteTask(item.id)
              }
            >
              <MaterialIcons
                name="delete"
                size={22}
                color="#E53935"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F2A44',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
  },

  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2E5BBA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1F2A44',
  },

  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});