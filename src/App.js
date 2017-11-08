import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Note from './note/note';
import NoteForm from './noteForm/noteForm';
import {DB_CONFIG} from './config/config';
import firebase from 'firebase/app';
import 'firebase/database';

class App extends Component {

  constructor(props) {
    super(props);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('notes');
    //setup react state of component
    this.state = {
      notes: [],
    }
  }
componentWillMount(){
  const previousNotes =this.state.notes;

  //Data Snapshots
  this.database.on('child_added', snap => {
    previousNotes.push({
      id: snap.key,
      noteContent: snap.val().noteContent,
    })
    this.setState({
      notes:previousNotes
    })
  })

  this.database.on('child_removed',snap =>{
    for(var i=0; i<previousNotes.length;i++){
      if(previousNotes[i].id==snap.key){
        previousNotes.splice(i,1);
      }
    }
    this.setState({
      notes:previousNotes
    })
  })
}

  addNote(note) {
    // const previousNotes = this.state.notes;
    // previousNotes.push({
    //   id: previousNotes.length + 1,
    //   noteContent: note
    // });
    // this.setState({
    //   notes: previousNotes
    // })

      this.database.push().set({
        noteContent:note
      })
  }
  removeNote(noteId){
    this.database.child(noteId).remove();
  }

  render() {
    return (
      <div className='notesWrapper'>
        <div className='notesHeader'>
          <div className='Heading'>React and Firebase To-do List</div>

        </div>
        <div className='notesBody'>
          {
            this.state.notes.map((note) => {
              return (
                <Note noteContent={note.noteContent}
                 noteId={note.id}
                  key={note.id}
                   removeNote={this.removeNote}/>
              )

            })

          }

        </div>
        <div className='notesFooter'>
          <NoteForm addNote={this.addNote} />
        </div>

      </div>
    );
  }
}

export default App;
