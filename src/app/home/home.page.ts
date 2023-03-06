import { Component, OnInit } from '@angular/core';
import { ImagenAstronomicaService } from 'src/app/api/imagenAstronomica.service';
import { Database } from 'src/app/bd/database.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  fecha = new Date();
  imagenDia = [];
  imagenEnUnaFecha = [];
  favoritas = [];
  inicio = true

  constructor( private imagenAstronomicaService: ImagenAstronomicaService,
    private controlNav:NavController ,private router:Router, private toastController: ToastController, private alertController: AlertController,
  private database: Database, private platform: Platform){
    this.platform.ready().then(()=>{
      this.database.createDatabase()
    })
  }

  ngOnInit() {
    this.inicio = true
  }

  async information() {
    const toast = await this.toastController.create({
      header: 'Información',
      message: 'Busca una imagen astronomica',
      position:'middle',
      buttons: [
        {
          side: 'start',
          icon: 'information',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Salir',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getFavorites(){
    this.database.getImagenes().then((data)=>{
      if (data.rows.length <= 0){
        this.toastMsg("No hay imagenes astronomicas marcadas como favoritas");
      }else{
        this.inicio = false
        this.favoritas = []
        console.log("Data: " + data)
        for (var i = 0; i < data.rows.length; i++) {
          this.favoritas.push(data.rows.item(i));
          console.log("Pushea: " + data.rows.item(i))
        }
        
      }
  })
  }

  home(){
    this.inicio = true
    this.imagenDia = []
    this.imagenEnUnaFecha = []
    this.favoritas = []
    this.controlNav.navigateRoot('')
  }

  search(){
    this.imagenDia = [];
      this.imagenAstronomicaService.findImagenDelDia().subscribe ((response) => {
        if (response["error"]){
          this.toastController
          this.toastMsg('No hubo resultados');
        }else{
          this.imagenDia.push(response)
        }
    },
      (err: HttpErrorResponse) => {
        console.log('Estado de error: ', err.status, typeof err.status);
        this.imagenDia = []
      })    
    }

    searchDay(){
      this.imagenEnUnaFecha = [];
      this.imagenAstronomicaService.findImagenDelDiaEnUnaFecha(this.fecha).subscribe ((response) => {
        if (response["error"]){
          this.toastController
          this.toastMsg('No hubo resultados');
        }else{
          this.imagenEnUnaFecha.push(response);
        }
    },
      (err: HttpErrorResponse) => {
        console.log('Estado de error: ', err.status, typeof err.status);
        this.imagenEnUnaFecha = []
      }
    )  
    } 

  async toastMsg(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position:'middle',
    });
    toast.present();
  }

  mostrarImagen(fecha){
    this.inicio = true
    this.controlNav.navigateForward('/imagen-astronomica/'+fecha)
  }

}

