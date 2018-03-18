/* global document */
import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import './normalize.css';
import './skeleton.css';
import './App.css';

const Header = styled.h1`
  text-align: center;
`;

const LeftContainer = styled.div`
  flex: 0.5;
  order: 1;
  height: 100%;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  display: flex;
  padding: 2em;
  flex-direction: column;
  align-items: center;
  margin: 1em;
`;

const RightContainer = styled.div`
  flex: 0.5;
  order: 2;
  height: 100%;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  display: flex;
  padding: 2em;
  flex-direction: column;
  align-items: center;
  margin: 1em;
`;

const Task = styled.div`
  background-color: #e3f2fd;
  box-shadow: 2px 2px #c5cae9;
  display: flex;
  align-items: center;
  margin: 1em;
  padding: 0.5em;
  height: 4em;
  width: 10em;
`;

const Status = styled.div`
  background-color: #bbdefb;
  border-radius: 100%;
  height: 0.5em;
  width: 0.5em;
  margin: 0.3em;
`;

const FormContainer = styled.div`
  flex: 0.1;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Name = styled.span``;

const Input = styled.input``;

const COMPLETE = 'complete';
const INCOMPLETE = 'incomplete';

class App extends React.Component {
  state = {
    newTask: { name: '', status: INCOMPLETE },
    tasks: []
  };

  onDragStart = (event, id) => {
    event.dataTransfer.setData('id', id);
  };

  onDragOver = (event) => {
    event.preventDefault();
  };

  onDrop = (event, newStatus) => {
    const id = event.dataTransfer.getData('id');
    const tasks = this.state.tasks.map(task => (
      task.name === id ? { ...task, status: newStatus } : task
    ));

    this.setState({
      ...this.state,
      tasks
    });
  };

  onChange = (id, value) => {
    const newTask = { ...this.state.newTask };
    newTask[id] = value;
    this.setState({ newTask });
  };

  addTask = (key) => {
    if (key === 'Enter' || key === 'clicked') {
      this.setState(prevState => ({
        tasks: [...prevState.tasks, prevState.newTask],
        newTask: {
          name: '',
          status: INCOMPLETE
        }
      }));
    }
  };

  renderTask = task => (
    <Task
      key={task.name}
      onDragStart={event => this.onDragStart(event, task.name)}
      draggable
    >
      <Status
        style={
          task.status === COMPLETE
            ? { background: '#A5D6A7' }
            : { background: '#EF5350' }
        }
      />
      <Name>{task.name}</Name>
    </Task>
  );

  render() {
    const tasks = {
      incomplete: [],
      complete: []
    };

    this.state.tasks.forEach((task) => {
      tasks[task.status].push(this.renderTask(task));
    });

    return (
      <div className="container" style={{ marginTop: '2em' }}>
        <div className="row container">
          <Header>Drag & Drop!</Header>
          <FormContainer>
            <Input
              id="task-name"
              type="text"
              placeholder="Enter a task..."
              value={this.state.newTask.name}
              onKeyDown={({ key }) => this.addTask(key)}
              onChange={({ target: { value } }) => this.onChange('name', value)}
            />
            <select
              value={this.state.newTask.status}
              onChange={({ target: { value } }) =>
                this.onChange('status', value)
              }
            >
              <option value={INCOMPLETE}>Incomplete</option>
              <option value={COMPLETE}>Complete</option>
            </select>
            <button onClick={() => this.addTask('clicked')}>Add Task</button>
          </FormContainer>
        </div>
        <div className="row container" style={{ display: 'flex', height: '40em' }}>
          <LeftContainer
            onDragOver={event => this.onDragOver(event)}
            onDrop={event => this.onDrop(event, INCOMPLETE)}
          >
            <Header>Incomplete</Header>
            {tasks.incomplete}
          </LeftContainer>
          <RightContainer
            onDragOver={event => this.onDragOver(event)}
            onDrop={event => this.onDrop(event, COMPLETE)}
          >
            <Header>Complete</Header>
            {tasks.complete}
          </RightContainer>
        </div>
      </div>
    );
  }
}

export default App;

render(<App />, document.getElementById('app'));
