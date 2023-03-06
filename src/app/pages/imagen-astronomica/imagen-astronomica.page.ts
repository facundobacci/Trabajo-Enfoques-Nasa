import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagenAstronomicaService } from 'src/app/api/imagenAstronomica.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Database } from 'src/app/bd/database.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  templateUrl: './imagen-astronomica.page.html',
  styleUrls: ['./imagen-astronomica.page.scss'],
})
export class ImagenAstronomicaPage implements OnInit {
  imagen={}
  imagenSeleccionada=[]
  favoritas=[]
  fecha=""
  constructor(private imagenAstronomicaService: ImagenAstronomicaService, private controlNav:NavController, private toastController: ToastController, private router:Router, public database: Database,
    private activatedRoute: ActivatedRoute, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data)=>{
      this.fecha=data.fecha
    })
    this.imagenAstronomicaService.findImagenDelDiaEnUnaFecha(this.fecha).subscribe ((response) => {
      this.imagenSeleccionada.push(response)
      this.database.findFavorita(this.fecha).then((data)=>{
        if (data.rows.length > 0){
          document.getElementById("notFavorite").setAttribute("hidden","hidden")
          document.getElementById("favorite").removeAttribute("hidden")
        }
      }).catch((e)=>{
        console.log(JSON.stringify(e))
      })
    }, (err: HttpErrorResponse) => {
      console.log('Estado de error: ', err.status, typeof err.status);
      this.imagenSeleccionada[0] = []
      this.database.findFavorita(this.fecha).then((data) =>{
        if (data.rows.length > 0){
          let result=data.rows.item(0)
          this.imagen={
            url:result.url,
            titulo:result.titulo,
            descripcion : result.explicacion,
            fecha : result.fecha,
          }
          this.toastMsg("Sin Conexión, datos recuperados por base.");
        }else{
          this.imagen={}
          this.toastMsg("Sin Conexión");
        }
      })
    }
  )}

  async information() {
    const toast = await this.toastController.create({
      header: 'Información',
      message: 'Informacion de la imagen astronomica, podes compartirla en redes sociales y/o marcarla como favorita!',
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

  return(){
    this.controlNav.navigateRoot('/home')
  }

  favorite(){
    console.log(this.imagenSeleccionada[0])
    this.database.findFavorita(this.imagenSeleccionada[0]["date"]).then((data)=>{
      if (data.rows.length > 0){
        this.unmarkAsFavorite(this.imagenSeleccionada[0]["date"]);
        this.toastMsg("Imagen removida de Mis Favoritas");
        document.getElementById("favorite").setAttribute("hidden","hidden")
        document.getElementById("notFavorite").removeAttribute("hidden")
      }else{
        this.markAsFavorite();
        this.toastMsg("Imagen agregada a Mis Favoritas");
        document.getElementById("notFavorite").setAttribute("hidden","hidden")
        document.getElementById("favorite").removeAttribute("hidden")
      }
    })

  }

  markAsFavorite(){
    this.database.insertImagen(this.imagenSeleccionada[0])
  }

  unmarkAsFavorite(fecha){
    this.database.deleteImagen(fecha)
  }

  compartir(){
    let imageUrl= this.imagenSeleccionada[0]["url"]
    let text= "Mi imagen astronomica favorita es: " + this.imagenSeleccionada[0]["title"]
    this.socialSharing.share(text,"",imageUrl)
  }

  async toastMsg(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position:'middle',
    });
    toast.present();
  }

}
