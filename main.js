import './style.css'
import { App } from "./src/todos/app.js";
import todoStore from "./src/store/todo.store.js";

todoStore.initStore(); // Ejecutar la función initStore() del store
App('#app'); // Ejecutar la función App() con el id del elemento HTML donde se renderizará la aplicación