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

    //remove task
    //tasks can only be deleted if they were created 5 days ago
    const deleteTask = (id) => {
      const api = 'http://localhost:8080/tasks'
      try{
        axios.delete(`${api}/${id}`)
        .then(response => {
          setTasks(response.data)
        })
      }
      catch (error) {
        console.log("Tasks can only be deleted after 5 days")
      }
    }
    //finished and update have cors related errors
    const finishTask = (taskId) => {
      const api = 'http://localhost:8080/tasks'
      axios.put(`${api}/${taskId}`, {status: 'COMPLETED'})
      .then(response => {
        setTasks(tasks.map(task=> task.id === taskId ? response.data : task))
      })
    }
    const updateTask =(taskId) => {
      const api = 'http://localhost:8080/tasks'
      axios.put(`${api}/${taskId}`, {status: 'IN_PROGRESS'})
      .then(response => {
        setTasks(tasks.map(task=> task.id === taskId ? response.data : task))
      })
    }
  return (
    <div className='app'>
      <header>
        <h1 className='header'>Tasks</h1>

        
        <h1 className="title">Add task</h1>
        <form onSubmit={createTask}> {/* Add onSubmit handler */}
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

      <p>Search task</p>
      <Filter onFilterChange={handleChange} filterText={filter} />
      <div className='tasks'>
        <h3>Your tasks</h3>
        <p>by due date order</p>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
                      <h3>{task.name}
                        <button className='btn' onClick={deleteTask}>🗑️</button>
                        </h3>
                      <p>{task.description}</p>
                      <p>Due Date: {task.dueDate}</p>
                      <p>Status: {task.status}</p>
                      <button className='btn' onClick={updateTask}>In progress</button>
                      <button className='btn-done' onClick={finishTask}>Done</button>
                    </li>
                  ))}
                </ul>
      </div>
    </div>
  )
}
export default App
