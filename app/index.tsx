import { useEffect, useState } from "react";
import { Button, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  name: string;
  completed: boolean;
  id: string;
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  {/* - Persist tasks using AsyncStorage. */ }
  useEffect(() => {
    async function loadTasks() {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (!storedTasks) return;
      setTasks(JSON.parse(storedTasks));
    }

    loadTasks();
  }, []);

  // save tasks to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) {
      return createError("Task name cannot be empty");
    }

    const newTaskObj: Task = {
      name: newTask,
      completed: false,
      id: `${Date.now()}`,
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask("");
    Keyboard.dismiss();
  };

  function createError(message: string) {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  function editTask(task: Task) {
    setNewTask(task.name);
    deleteTask(task);
  }

  function deleteTask(task: Task) {
    setTasks((prev) => prev.filter(t => t.id !== task.id));
  }

  function completeTask(task: Task) {
    setTasks((prev) => prev.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
  }

  return (
    <SafeAreaView style={{ margin: 16 }}>

      {/* - Add */}
      <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
        <TextInput
          style={{ flex: 1, height: 40, backgroundColor: "lightgray", fontWeight: "bold", paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }}
          placeholder="new task name!"
          value={newTask}
          onChangeText={newText => setNewTask(newText)}
        />
        <Button
          title="Add Task"
          onPress={addTask} />
      </View>
      {/* - Error */}

      {
        error
          ? <Text style={{ height: 20, color: "red", textAlign: "center" }}>{error}</Text>
          : <View style={{ height: 20 }}></View>
      }

      {
        tasks.map((task) =>
          <View key={task.id} style={{ backgroundColor: task.completed ? "gray" : "lightgray", marginTop: 10, padding: 10, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ textDecorationLine: task.completed ? "line-through" : "none" }}>{task.name}</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* - edit */}
              <Button
                title="Edit"
                color={"orange"}
                onPress={() => editTask(task)} />

              {/* - delete */}
              <Button
                title="Delete"
                color={"red"}
                onPress={() => deleteTask(task)} />

              {/* - mark tasks as complete. */}
              <Button title={task.completed ? "Undo" : "Done"} onPress={() => completeTask(task)} />
            </View>
          </View>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: "lightgray",
    marginTop: 10,
    padding: 10,
    borderRadius: 15,
  },
});
