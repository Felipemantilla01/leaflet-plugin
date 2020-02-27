import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FetchDataService } from './services/fetch-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'leaflet-plugin';
  markers
  lines
constructor(
  private _fetchData : FetchDataService
){
  
}

async ngAfterViewInit(){
  await this._fetchData.getData().subscribe(res=>{
    
    this.markers = res['markers']['markers']//obtenemos los marcadores
    // console.log(this.markers)
    this.lines = res['lines']
    // console.log(this.lines)


  },
  err=>console.log(err))    
}

guardarMapa($event){
  console.log('Guardando mapa')
  // console.log($event)

  this._fetchData.sendData($event).subscribe(
    res=>console.log(res),
    err=>console.log(err)
  )

}


}

