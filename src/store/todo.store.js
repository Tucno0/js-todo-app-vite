import { Todo } from "../todos/models/todo.model";

export const Filters = {
  All: 'all',
  Completed: 'Completed',
  Pending: 'Pending'
}

const state = {
  todos: [
    new Todo( 'Piedra del alma' ),
    new Todo( 'Piedra del espacio' ),
    new Todo( 'Piedra del tiempo' ),
    new Todo( 'Piedra del poder' ),
    new Todo( 'Piedra de la realidad' ),
  ],
  filter: Filters.All,
}

const initStore = () => {
  loadStore();
  console.log('InitStore 🥑');
}

const loadStore = () => {
  console.log('LoadStore 🥑');
  const stateFromLocalStorage = localStorage.getItem('state'); // Obtener el estado del localStorage
  if ( !stateFromLocalStorage ) return; // Si no hay estado en el localStorage, no hacer nada

  const { todos = [], filter = Filters.All } = JSON.parse( stateFromLocalStorage ); // Obtener los todos y el filtro del estado guardado en el localStorage

  state.todos = todos;
  state.filter = filter;
  
}

const saveStateToLocalStorage = () => {
  localStorage.setItem('state', JSON.stringify(state)); // Guardar el estado en el localStorage, convirtiendo el objeto state a string con JSON.stringify()
}

const getTodos = ( filter = Filters.All ) => {
  switch ( filter ) {
    case Filters.All:
      return [...state.todos];

    case Filters.Completed:
      return state.todos.filter( todo => todo.done ); // Devuelve un nuevo array con los elementos que cumplan la condición, en este caso, los que tengan done = true

    case Filters.Pending:
      return state.todos.filter( todo => !todo.done ); // Devuelve un nuevo array con los elementos que cumplan la condición, en este caso, los que tengan done = false

    default:
      throw new Error(`Option ${filter} is not valid`);
  }
}

/**
 * 
 * @param {String} description 
 */
const addTodo = ( description ) => {
  if ( !description ) throw new Error('Description is required');

  state.todos.push( new Todo ( description ) );

  saveStateToLocalStorage();
}

/**
 * 
 * @param {String} todoId Todo identifier
 */
const toggleTodo = ( todoId ) => {
  state.todos = state.todos.map( todo => { // Devuelve un nuevo array con los elementos que cumplan la condición, en este caso, los que tengan id igual al id del todo que se quiere modificar.
    if ( todo.id === todoId ) {
      todo.done = !todo.done;
    }
    return todo;
  });

  saveStateToLocalStorage();
}

/**
 * 
 * @param {String} todoId Todo identifier
 */
const deleteTodo = ( todoId ) => {
  state.todos = state.todos.filter( todo => todo.id !== todoId ); // Devuelve un nuevo array con los elementos que cumplan la condición, en este caso, los que tengan id distinto al id del todo que se quiere eliminar.

  saveStateToLocalStorage();
}

const deleteCompleted = () => {
  state.todos = state.todos.filter( todo => !todo.done ); // Devuelve un nuevo array con los elementos que cumplan la condición, en este caso, los que tengan done = true

  saveStateToLocalStorage();
}

/**
 * 
 * @param {Filters} filter 
 */
const setFilter = ( newFilter = Filters.All ) => {
  state.filter = newFilter;

  saveStateToLocalStorage();
}

const getCurrentFilter = () => {
  return state.filter;
}

export default {
  addTodo,
  deleteCompleted,
  deleteTodo,
  getCurrentFilter,
  getTodos,
  initStore,
  loadStore,
  setFilter,
  toggleTodo,
}