import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class Database {
  database: SQLiteObject;
  tables = {
        imagenes: "imagenes_favoritas"
  }

  constructor(private sqlite: SQLite) {}

  async createDatabase(){
    await this.sqlite.create({
        name:"imagenesAstronomicas",
        location:"default"
    })
    .then((database: SQLiteObject)=>{
        this.database=database;
        console.log(database + "esta es la database creada")
    })
    .catch((e)=>{
        alert("Error creando la base de datos " + JSON.stringify(e));
    });

    await this.createTablas();
    
  }

  async createTablas(){
    console.log("Creando tabla")
    await this.database.executeSql(
    `CREATE TABLE IF NOT EXISTS ${this.tables.imagenes} ( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
      fecha VARCHAR(255) NULL UNIQUE, titulo VARCHAR(255) NULL, explicacion VARCHAR(255) NULL, url LONGTEXT NULL)`,
    []
    );
    console.log("Se creo la tabla")
  }

  async insertImagen(imagen){
    console.log(imagen)
    return this.database.executeSql(
        `INSERT INTO ${this.tables.imagenes} (fecha, titulo, explicacion, url) VALUES ("${imagen.date}","${imagen.title}","${imagen.explanation}","${imagen.url}")`,
    []
    ).then(()=>{
        console.log("Imagen astronomica agregada a la tabla")
        return true
    })
    .catch((e)=>{
      console.log(e)
        return "Error Insertando imagen astronomica: " + JSON.stringify(e)
    })
  }

  async deleteImagen(fecha){
    return this.database
        .executeSql(`DELETE FROM ${this.tables.imagenes} WHERE fecha = '${fecha}'`, [])
        .then(() => {
            return "Imagen astronomica eliminada";
        })
        .catch((e) => {
            return "Error eliminando imagen astronomica: " + JSON.stringify(e);
    });
  }

  async findFavorita(fecha){
    console.log(typeof(fecha))
    return this.database.executeSql(
        `SELECT * from ${this.tables.imagenes} where fecha = '${fecha}'`,
        []
    ).then((response)=>{
      console.log(response)
      return response;
    })
    .catch((e)=>{
      console.log(JSON.stringify(e))
      return JSON.stringify(e)
    })
  }

  async getImagenes(){
    return this.database.executeSql(
        `SELECT * from ${this.tables.imagenes}`,
        []
    ).then((response)=>{
        return response;
    })
    .catch((e)=>{
        return JSON.stringify(e)
    })
  }

  async deleteDatabase(){
    this.sqlite.deleteDatabase({ name: "imagenesAstronomicas", location: 'default'})
    .then(()=>{
        return "Base de Datos Borrada"
    })
    .catch((e)=>{
        return "Falló"
    })
    
  }


}
