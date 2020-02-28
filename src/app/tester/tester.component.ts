import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FetchDataService } from '../services/fetch-data.service';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.scss']
})
export class TesterComponent implements AfterViewInit {

  editable:boolean=false
  nodos
  lineas
  progreso:number = 10

  constructor(
    private _fetchData : FetchDataService
  ){}

  async ngAfterViewInit(){
    await this._fetchData.getData().subscribe(res=>{      
      this.nodos = res['markers']['markers']//obtenemos los marcadores
      // console.log(this.markers)
      this.lineas = res['lines']
      // console.log(this.lines)
    },
    err=>console.log(err))    
  }
  
  guardarMapa($event){
    console.log('Guardando mapa....')
    // console.log($event)
  
    this._fetchData.sendData($event).subscribe(
      res=>console.log(res),
      err=>console.log(err)
    )

    
  }
  
  incrementProgress(){
    this.progreso+=10;
    console.log(this.progreso)
    if(this.progreso>100){
      this.progreso=10
    }    
  }

  abrirProceso($event){
    console.log($event)
  }



}
