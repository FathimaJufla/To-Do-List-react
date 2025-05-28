import React, { useEffect, useRef, useState } from 'react'
import todoIcon from '../assets/todo_icon.png'
import TodoItems from './TodoItems'

const Todo = () => {

  const getInitialTodos = () => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (!storedTodos) return [];
      const parsedTodos = JSON.parse(storedTodos);
      return Array.isArray(parsedTodos) ? parsedTodos.filter(todo => 
        todo && typeof todo === 'object' && 
        'id' in todo && 
        'text' in todo && 
        'isComplete' in todo
      ) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  };

  const [todoList, setTodoList] = useState(getInitialTodos());

  const inputRef = useRef();

  const add = () =>{
    const inputText = inputRef.current.value.trim();

    if (inputText === '') {
        return null;
    }

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
    }
    setTodoList((prev)=> [...prev, newTodo]);
    inputRef.current.value = "";
  }

  const deleteTodo = (id) => {
    setTodoList((prvTodos)=>{
     return prvTodos.filter((todo) => todo.id !==id)
    })
  }

  const toggle = (id) => {
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  useEffect(()=>{
    localStorage.setItem('todos', JSON.stringify(todoList));
  },[todoList])

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl'>
      <div className='flex items-center mt-7 gap-2'>
        <img src={todoIcon} alt="icon" className='w-10'/>
        <h1 className='text-3xl font-semibold'>To-Do List</h1>
      </div>

      <div className='flex items-center my-7 bg-gray-200 rounded-full justify-between'>
        <input ref={inputRef} className='pl-6 border-0 outline-0 bg-transparent flex-1 h-14 pr-2 placeholder:text-slate-600' type="text" placeholder='Add your task' />
        <button onClick={add} className='border-none bg-orange-500 rounded-full w-30 h-14 text-white text-lg font-medium cursor-pointer'>ADD +</button>
      </div>

      <div>
        {todoList.map((item, index) => {
          if (!item || typeof item !== 'object') return null;
          return (
            <TodoItems 
              key={item.id} 
              text={item.text} 
              id={item.id} 
              isComplete={item.isComplete} 
              deleteTodo={deleteTodo} 
              toggle={toggle}
            />
          );
        })}
      </div>


    </div>
  )
}

export default Todo
