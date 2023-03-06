import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ImagenAstronomicaService {

  constructor(private http: HttpClient, private router: Router, public datepipe:DatePipe) {}

  findImagenDelDia(){
    return this.http.get<Object>(
      `https://api.nasa.gov/planetary/apod?api_key=b9P1hZ8yjhQ5WNPNMETihKF9CAwu1HiHhdWXtSUX`
    )
  }

  findImagenDelDiaEnUnaFecha(fecha){
    fecha = this.datepipe.transform(fecha, 'yyyy-MM-dd').slice(0,10)
    return this.http.get<Object>(
      `https://api.nasa.gov/planetary/apod?date=${fecha}&api_key=b9P1hZ8yjhQ5WNPNMETihKF9CAwu1HiHhdWXtSUX`
    )
  } 
}
