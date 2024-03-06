import './App.css';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';


function App() {
  return (
    <MantineProvider><KanbanBoard /></MantineProvider>
  );
}

export default App;
