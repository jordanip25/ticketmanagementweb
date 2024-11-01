import React, { useState, Component, useReducer } from "react";
import ReactDOM from "react-dom";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import "@fontsource/karla";
import './index.css';

const StyledCardForm = styled.div`
  flex: 0 0 auto;
  background-color: #e0e0e0;
  border-radius: 8px;
  max-width: 50em;
  overflow: hidden;
  padding: 1em 1em;
  font-family: Karla;
  box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.5);

  h2 {
    color: #343a40;
    margin: 0;
    padding-top: .25em;
    border-bottom: 1px solid #aeaeae;
    padding-bottom: .75em;
  }
  
  ul {
    list-style: none;
    padding: 0;
  
    li:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;

const StyledTextInput = styled.div`
  color: #343a40;

  label {
    display: inline;
    font-family: Karla;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    outline: none;
    border: 1px solid #ebecee;
    font-family: Karla;
    padding: 10px;
    margin: 10px 0;
  }

  input:focus {
    border-color: #64b5f6;
}
`;

const TextInput = ({ label, type = "text", id, defaultValue, ...props }) => (
  <StyledTextInput>
    {label && <label htmlFor={id}>{label}</label>}
    <input id={id} type={type} defaultValue={defaultValue} {...props} />
  </StyledTextInput>
);

//Componente que recibe el id del ticket y lo muestra en pantalla
export default class Incidemte extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        id: 0,
        transDate: '',
        transTime: '',
        status: '',
        priority: '',
        complexity: '',
        description: '',
        tipo: '',
        solicitante: '',
        asignado: '',
        responsable: '',
        solucion: '',
        usuariosDisponibles: [],
        TIDisponibles: [],
        draggedOverCol: 0
      };

      this.handleChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      var server_request_uri = location.pathname + location.search;
      var incidenteId = server_request_uri.substring(11,server_request_uri.length);
      console.log(incidenteId);
      this.setState({ id: incidenteId })
      fetch('/getincidente/'+incidenteId, {
        credentials: 'include'
      })
      .then((response) => {
          if (response.ok) {
              return response.json();
          } else {
              console.log('Error with session response');
          }
      })
      .then((result) => {
          // Set the state of data.
          //this.setState({ data: result['data']})
          console.log(result);
          //obtener keys del objeto result
          var keys = Object.keys(result);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = result[key].toString().toUpperCase();
            this.setState({ [key]: value });
          }
          this.setState({ isLoading: false });
      })
      .catch((error) => {
          console.log('Error: ', error);
          //window.location.href="/";
      });

      fetch('/getusuarios', {
        credentials: 'include'
      })
      .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Error with session response');
        }
      })
      .then((result) => {
          // Set the state of data.
          var keys = Object.keys(result['data']);
          console.log(result['data']);
          //crear arreglo
          var usuarios = [];
          var tiusuarios = [];
          for (var i = 0; i < keys.length; i++) {
            var value = result['data'][keys[i]]['area'].toString().toUpperCase();
            if (value === "SISTEMAS"){
              console.log(result['data'][keys[i]]);
              tiusuarios.push(result['data'][keys[i]]);
            }
            console.log(result['data'][keys[i]]);
            usuarios.push(result['data'][keys[i]]);
          }
          this.setState({ usuariosDisponibles: usuarios});
          this.setState({ TIDisponibles: tiusuarios});
      })
      .catch((error) => {
          console.log('Error: ', error);
      });

      console.log(this.state.usuariosDisponibles);
      console.log(this.state.TIDisponibles);
    }
  
    handleInputChange(event) {
      const target = event.target;
      const defaultValue = target.type === 'checkbox' ? target.checked : target.defaultValue;
      const name = target.name;
      
      this.setState({
        [name]: defaultValue
      });
      console.log('Change detected. State updated' + name + ' = ' + defaultValue);
    }

    handleSubmit(event) {
      alert('A form was submitted: ' + this.state.name + ' // ' + this.state.email);
      event.preventDefault();
    }

    

    render() {

      function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }
  
      function formatDate(date = new Date()) {
        return [
          date.getFullYear(),
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate())
        ].join('-');
      }
      
      function zfill(number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */ 
        var zero = "0"; /* String de cero */  
        
        if (width <= length) {
            if (number < 0) {
                 return ("-" + numberOutput.toString()); 
            } else {
                 return numberOutput.toString(); 
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString()); 
            }
        }
      }
    

      return (
        <div>
          <StyledCardForm >
    <h2>{"INCIDENTE INC"+zfill(this.state.id,4)}</h2>
    <form>
    <ul style={{'listStyleType': 'none',  'display': 'inline-block', 'height': '70px'}}>
        <li style={{'minWidth': '5em','display': 'inline-block'}}>
          <TextInput
            label="Fecha"
            id="transDate"
            type="date"
            defaultValue={this.state.transDate}
            placeholder={formatDate()}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            minLength="1"
            maxLength="20"
            width = "2em"
            required
          />
        </li>
        <li style={{'minWidth': '5em', 'margin': '0 0.5em','display': 'inline-block'}}>
          <TextInput
            label="Hora"
            id="TransTime"
            type="time"
            defaultValue={this.state.transTime}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            //placeholder="**** **** **** ****"
            minLength="1"
            maxLength="20"
            width = "2em"
            required
          />
        </li>
      </ul>
      <ul style={{'minWidth': '40em', 'display': 'inline-block', 'height': '70px'}}>
        <li style={{'maxWidth': '10em', 'display': 'inline-block'}}>
          <TextInput
            label="Estado"
            id="status"
            type="text"
            list="listaEstados"
            autoComplete="on" 
            defaultValue={this.state.status}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Estado"
            minLength="4"
            maxLength="12"
            required
          />
          <datalist id="listaEstados">
            <option value="Pendiente"></option>
            <option value="Asignado"></option>
            <option value="En Progreso"></option>
            <option value="Completado"></option>
            <option value="Cancelado"></option>
          </datalist>

        </li>
        <li style={{'maxWidth': '10em', 'margin': '0 0.5em','display': 'inline-block'}}>
          <TextInput
            label="Prioridad"
            id="priority"
            type="text"
            list="listaPrioridades"
            autoComplete="on" 
            defaultValue={this.state.priority}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Prioridad"
            minLength="4"
            maxLength="6"
            width = "1.5em"
            required
          />
          <datalist id="listaPrioridades">
            <option value="Alto"></option>
            <option value="Medio"></option>
            <option value="Bajo"></option>
          </datalist>
        </li>
        <li style={{'maxWidth': '10em', 'margin': '0 0.5em','display': 'inline-block'}}>
          <TextInput
            label="Complejidad"
            id="complexity"
            type="text"
            list="listaComplejidades"
            autoComplete="on" 
            defaultValue={this.state.complexity}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Complejidad"
            minLength="4"
            maxLength="6"
            width = "1.5em"
            required
            />
          <datalist id="listaComplejidades">
            <option value="Alta"></option>
            <option value="Media"></option>
            <option value="Baja"></option>
          </datalist>
        </li>
        </ul>
        <ul>
        <li>
          <TextInput
            label="Descripción"
            id="description"
            type="text"
            defaultValue={this.state.description}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Descripción"
            minLength="2"
            maxLength="20"
            width = "1.5em"
            required
          />
        </li>
        <li>
          <TextInput
            label="Tipo"
            id="tipo"
            type="text"
            list="listaTipos"
            defaultValue={this.state.tipo}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Tipo"
            minLength="2"
            maxLength="6"
            required
          />
          <datalist id="listaTipos">
            <option value="Red"></option>
            <option value="Software"></option>
            <option value="Hardware"></option>
          </datalist>
        </li>
        <li>
          <TextInput
            label="Solicitante"
            id="solicitante"
            type="text"
            defaultValue={this.state.solicitante}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Solicitante"
            minLength="2"
            maxLength="12"
            required
          />
        </li>
        <li>
          <TextInput
            label="Asignado"
            id="asignado"
            type="text"
            defaultValue={this.state.asignado}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Asignado"
            minLength="2"
            maxLength="12"
            required
          />
        </li>
        <li>
          <TextInput
            label="Responsable"
            id="responsable"
            type="text"
            defaultValue={this.state.responsable}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Responsable"
            minLength="2"
            maxLength="12"
            required
          />
        </li>
        <li>
          <TextInput
            label="Solucion"
            id="solucion"
            type="autocomplete"
            defaultValue={this.state.solucion}
            onChange={e => this.setState({[e.target.id]: e.target.defaultValue})}
            placeholder="Solucion"
            minLength="2"
            maxLength="20"
            />
        </li>
      </ul>
    </form>
  </StyledCardForm>
        </div>
      )
    }
}
