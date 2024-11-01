import React from "react";
import axios from 'axios';
//import "@fontsource/karla";

let colorCard: string = "#f9fdf7";

interface Column {
  name: string;
  stage: number;
  color: string;
}

let columnList: Column[] = [
  { name: "EN PROGRESO", stage: 1, color: "#F8CC8A" },
  { name: "COMPLETADO", stage: 2, color: "#2B29CC" },
  { name: "CANCELADO", stage: 3, color: "#FF6B6B" }
];

interface Project {
  id: number;
  priority: number;
  name: string;
  date: string;
  description: string;
  status: number;
  color: string;
}


interface IBoardState {
  isLoading: boolean;
  projects: Project[];
  data: any[];
  draggedOverCol: number;
}

export default class IBoard extends React.Component<{}, IBoardState> {
  columns: Column[];

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: false,
      projects: [],
      data: [],
      draggedOverCol: 0
    };

    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columns = columnList;
  }

  ingresarPizarra() {
    const registros: Project[] = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const obj = this.state.data[i];
      const item: Partial<Project> = {};
  
      // Adaptando cada campo según la estructura requerida
      item.id = parseInt(obj.id); // Convierte el id a número
      item.priority = 1; // Puedes cambiar la prioridad si es necesario
      item.name = `${obj.nombre} ${obj.apellido}`.toUpperCase(); // Concatenación de nombre y apellido
      item.date = obj.fecha; // Asigna la fecha directamente
      item.description = JSON.stringify({ pregunta: obj.consulta, respuesta: obj.respuesta }); // JSON de consulta y respuesta
      item.status = this.getStatus(obj.feedback); // Obtiene el estado numérico basado en feedback
      item.color = colorCard; // Color predeterminado
  
      registros.push(item as Project);
    }
    console.log(registros);
    this.setState({ projects: registros, isLoading: false });
  }

  getStatus(status: string): number {
    switch (status) {
      case "Pendiente":
        return 1;
      case "Finalizado":
        return 2;
      case "Cancelado":
        return 3;
      default:
        return 1;
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }); // Indica que la carga está en proceso
    console.log("iniciando");
    axios.get("https://sandy-puddle-hydrangea.glitch.me/records")
      .then((response) => {
        const data = response.data;
        this.setState({ data }, () => this.ingresarPizarra());
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        this.setState({ isLoading: false });
      });
  }

  handleOnDragEnter(e: React.DragEvent) {//, stageValue: number
    e.preventDefault();
   // this.setState({ draggedOverCol: stageValue });
  }

  async handleOnDragEnd(e: React.DragEvent) { //, project: Project
    e.preventDefault();
    /*
    const updatedProjects = this.state.projects.slice(0);
    updatedProjects.find((projectObject) => projectObject.description === project.description)!.status = this.state.draggedOverCol;
    this.setState({ projects: updatedProjects });

    const formData = new FormData();
    Object.keys(project).forEach((key) => {
      if (key !== 'id') {
        if (key === "status") {
          const estado = this.getStatusLabel(project[key as keyof Project]);
          formData.append(key, estado);
        } else {
          formData.append(key, project[key as keyof Project] as string);
        }
      }
    });

    const jsonObject: Record<string, string> = { status: this.getStatusLabel(project.status) };
    */
    //Actualizar estado del ticket
    /*axios.patch(`/api/tickets/${project.id}`, jsonObject, { headers: { 'Content-Type': 'application/json' } })
      .then(response => console.log(JSON.stringify(response.data)))
      .catch(error => console.error(error));
    */
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return "Pendiente";
      case 2:
        return "Finalizado";
      case 3:
        return "Cancelado";
      default:
        return "Pendiente";
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div><div className={"loading"}>Loading&#8230;</div></div>;
    }

    return (
      <div>
        <div>
          {this.columns.map((column) => (
            <KanbanColumn
              name={column.name}
              stage={column.stage}
              color={column.color}
              projects={this.state.projects.filter((project) => project.status === column.stage)}
              onDragEnter={this.handleOnDragEnter}
              onDragEnd={this.handleOnDragEnd}
              key={column.stage}
            />
          ))}
        </div>
      </div>
    );
  }
}

interface KanbanColumnProps {
  name: string;
  stage: number;
  color: string;
  projects: Project[];
  onDragEnter: (e: React.DragEvent, stageValue: number) => void;
  onDragEnd: (e: React.DragEvent, project: Project) => void;
}

class KanbanColumn extends React.Component<KanbanColumnProps, { mouseIsHovering: boolean }> {
  constructor(props: KanbanColumnProps) {
    super(props);
    this.state = { mouseIsHovering: false };
  }

  generateKanbanCards() {
    return this.props.projects.map((project) => (
      <KanbanCard
        project={project}
        key={project.description}
        fecha={project.date}
        onDragEnd={this.props.onDragEnd}
      />
    ));
  }

  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          verticalAlign: 'top',
          marginRight: '5px',
          marginBottom: '5px',
          paddingLeft: '5px',
          paddingTop: '0px',
          width: '12.5em',
          height: '35em',
          textAlign: 'center',
          backgroundColor: this.state.mouseIsHovering ? '#d3d3d3' : this.props.color,
          borderRadius: '8px',
          borderStyle: 'solid',
          borderWidth: 'medium'
        }}
        onDragEnter={(e) => { this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.stage); }}
        onDragExit={(e) => {this.setState({ mouseIsHovering: false }); e.preventDefault(); } }
      >
        <h4>{this.props.name}</h4>
        {this.generateKanbanCards()}
        <br />
      </div>
    );
  }
}

interface KanbanCardProps {
  project: Project;
  fecha: string;
  onDragEnd: (e: React.DragEvent, project: Project) => void;
}

class KanbanCard extends React.Component<KanbanCardProps, { collapsed: boolean }> {
  constructor(props: KanbanCardProps) {
    super(props);
    this.state = { collapsed: true };
  }

  handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    //this.props.onDragEnd(e, this.props.project);
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({ collapsed: !prevState.collapsed }));
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          padding: '1em',
          margin: '0.5em 0',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          cursor: 'pointer'
        }}
        draggable
        onDragEnd={this.handleDragEnd}
        onClick={this.toggleCollapse}
      >
        <strong>{this.props.project.name}</strong>
        <p>{this.state.collapsed ? '' : this.props.fecha}</p>
        <p>{this.state.collapsed ? '' : this.props.project.description}</p>
      </div>
    );
  }
}
