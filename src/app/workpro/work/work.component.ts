import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FetchDataService } from 'src/app/services/fetch-data.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit {

  markers
  lines
  progress:number = 10
  editable:boolean = false

  constructor(
    private _fetchData : FetchDataService
  ){}

  async ngAfterViewInit(){
    await this._fetchData.getData().subscribe(res=>{      
      this.markers = res['markers']['markers']//obtenemos los marcadores
      // console.log(this.markers)
      this.lines = res['lines']
      // console.log(this.lines)
    },
    err=>console.log(err))    
  }
  
  saveMap($event){
    console.log('Guardando mapa')
    // console.log($event)
  
    this._fetchData.sendData($event).subscribe(
      res=>console.log(res),
      err=>console.log(err)
    )  
  }
  
  incrementProgress(){
    this.progress+=10;
    console.log(this.progress)
    if(this.progress>100){
      this.progress=10
    }    
  }

  openProcess(markerId){
    console.log(markerId)
  }

  changeEnvironment(){

  }
}
