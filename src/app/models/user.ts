export interface User {
  id_Dropinauta: number;
  firt_Name: string;
  last_Name: string;
  phone: string;
  email: string;
  photo_Profile: any;
  id_Departamento_FK: number;
  id_Municipio_FK: number;
  DepartamentoData: [];
  MunicipioData: [];
  direction: string;
  pass: string;
  codigo_Catalogo: string;
}
export interface Notifications {
  id_Notificacion_Dropinauta: number;
  new: boolean;
  title: string;
  date: Date;
  description: string;
  id_Notificacion_Remitente_FK: number;
  id_Remite: number;
  id_Dropinauta_FK: number;
  DropinautaData: any;
  NotificacionesRemiteData: {
    id_Notification_Remitente: number;
    remitente: any
  }
}