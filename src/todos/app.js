
import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw'; // Importar el archivo HTML como string (raw)
import { renderPending, renderTodos } from './use-cases';

const ElementIDs = {
  ClearCompletedButton: '.clear-completed',
  TodoList: '.todo-list',
  NewTodoInput: '#new-todo-input',
  TodoFilters: '.filtro',
  PendingCountLabel: '#pending-count'
}

/**
 * 
 * @param {String} elementId Elemento HTML donde se renderizará la aplicación
 */
export const App = ( elementId ) => {

  const displayTodos = () => {
    const todos = todoStore.getTodos( todoStore.getCurrentFilter() ); // Obtener los todos del store
    renderTodos(ElementIDs.TodoList, todos); // Renderizar los todos
    updatePendingCount();
  }

  const updatePendingCount = () => {
    renderPending( ElementIDs.PendingCountLabel );
  }

  // Cuando la funcion App() se ejecute, se ejecutará la función anónima
  (() => {
    const app = document.createElement('div'); // Crear un elemento HTML div 
    app.innerHTML = html; // Agregar contenido al elemento HTML
    document.querySelector(elementId).append(app); // Agregar el elemento HTML al elemento HTML con el id especificado
    displayTodos();
  })();

  // Referencias a elementos HTML
  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
  const todoListUl = document.querySelector(ElementIDs.TodoList);
  const clearCompletedButton = document.querySelector(ElementIDs.ClearCompletedButton);
  const filtersLIs = document.querySelectorAll(ElementIDs.TodoFilters);

  // Eventos

  // Evento para agregar un todo
  newDescriptionInput.addEventListener('keyup', (event) => {
    if ( event.keyCode !== 13 ) return; // Si la tecla presionada no es Enter, no hacer nada
    if ( event.target.value.trim().length === 0 ) return; // Si el input está vacío, no hacer nada

    todoStore.addTodo( event.target.value ); // Agregar un todo al store
    displayTodos(); // Renderizar los todos
    
    event.target.value = ''; // Limpiar el input
  });

  // Evento para marcar un todo como completado
  todoListUl.addEventListener('click', (event) => {
    const element = event.target.closest('[data-id]'); // Obtener el elemento HTML más cercano que tenga el atributo data-id
    todoStore.toggleTodo( element.getAttribute('data-id') );
    displayTodos();
  });

  // Evento para eliminar un todo
  todoListUl.addEventListener('click', (event) => {
    const isDestroyELement = event.target.className === 'destroy'; // Verificar si el elemento HTML tiene la clase destroy
    const element = event.target.closest('[data-id]'); // Obtener el elemento HTML más cercano que tenga el atributo data-id
    if ( !element || !isDestroyELement ) return; // Si no tiene la clase destroy, no hacer nada

    todoStore.deleteTodo( element.getAttribute('data-id') );
    displayTodos();
  });

  // Evento para eliminar todos los todos completados
  clearCompletedButton.addEventListener('click', () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  // Evento para filtrar los todos
  filtersLIs.forEach( element => {

    element.addEventListener('click', (element) => {
      filtersLIs.forEach( el => el.classList.remove('selected')); // Remover la clase selected de todos los elementos
      element.target.classList.add('selected');

      switch ( element.target.text ) {
        case 'Todos':
          todoStore.setFilter( Filters.All );
          break;

        case 'Pendientes':
          todoStore.setFilter( Filters.Pending );
          break;

        case 'Completados':
          todoStore.setFilter( Filters.Completed );
          break;

        // default:
        //   break;
      }

      displayTodos();
    });

  })
}