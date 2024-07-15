import { useState, useEffect} from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import './App.css'


const App = () => {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('')
  const [taskName, setTaskName]= useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')

    useEffect(() => {
      const api = 'http://localhost:8080/tasks'
      axios.get(api)
      .then(response => {
        setTasks(response.data)
        console.log(response.data)
      })
    },[])
    console.log(tasks)
    //create task
    const createTask = (event) => {
      event.preventDefault()
      const newTask = {
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'PENDING'
      }
      const api = 'http://localhost:8080/tasks'
      axios.post(api, newTask)
      .then(response => {
        setTasks(response.data)
        setTaskName('')
        setTaskDescription('')
        setTaskDueDate('')
      })
    }
    //filter tasks
    const handleChange = (filterText) => {
      setFilter(filterText)
      const filteredTasks = tasks.filter((task) => {
        return task.name.toLowerCase().includes(filterText.toLowerCase())
      })
      setTasks(filteredTasks)
    }

    const deleteTask = (id) => {
      const api = 'http://localhost:8080/tasks';    
      setTasks(tasks.filter(task => task.id !== id));    
      try {
        axios.delete(`${api}/${id}`)
          .then(response => {
            console.log("Task deleted successfully:", response.data); 
          })
      } catch (error) {
        console.log("Error deleting task:", error); 
        //preventing the UI from deleting task without deleting in on the backend
        setTasks([...tasks, { id, ...tasks.find(task => task.id === id) }]);
      }
    }
    
    const finishTask = (taskId) => {
      const api = 'http://localhost:8080/tasks';
      axios.put(`${api}/${taskId}/status`, { "status": "COMPLETED" })
        .then(() => {
          axios.get(`${api}/${taskId}`)
            .then(updatedTask => {
              setTasks(tasks.map(task => task.id === taskId ? updatedTask.data : task));
            });
        });
    };
    const updateTask = (taskId) => {
      const api = 'http://localhost:8080/tasks'
      axios.put(`${api}/${taskId}/status`, {"status": "IN_PROGRESS"})
      .then(() => {
        axios.get(`${api}/${taskId}`)
        .then(updatedTask => {
        setTasks(tasks.map(task=> task.id === taskId ? updatedTask.data : task))
      })
    })
  }
  return (
    <div className='app'>
      <header>
        <h1 className='header'>Tasks</h1>

        
        <h1 className="title">Add task</h1>
        <form onSubmit={createTask} className='form'> 
          <input
            type="text"
            placeholder="Title"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="text"
            placeholder='Description'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <button type="submit" className='btn'>Add</button>
        </form>

      </header>

      <div className='filter'>
      <p>Search task</p>
      <Filter onFilterChange={handleChange} filterText={filter} />
      </div>

      <div className='tasks'>
        <h3 className='task-title'>Your tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className='card'>
                      <h3>{task.name}
                        <button className='btn' onClick={() => deleteTask(task.id)}>🗑️</button>
                        </h3>
                      <p>{task.description}</p>
                      <p>Due Date: {task.dueDate}</p>
                      <p>Status: {task.status}</p>
                      <button className='btn' onClick={() => updateTask(task.id)}>In progress</button>
                      <button className='btn-done' onClick={() => finishTask(task.id)}>Done</button>
                    </li>
                  ))}
                </ul>
      </div>
    </div>
  )
}
export default App
