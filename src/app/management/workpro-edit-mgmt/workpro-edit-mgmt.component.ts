import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FetchDataService } from 'src/app/services/fetch-data.service';

@Component({
  selector: 'app-workpro-edit-mgmt',
  templateUrl: './workpro-edit-mgmt.component.html',
  styleUrls: ['./workpro-edit-mgmt.component.scss']
})
export class WorkproEditMgmtComponent implements AfterViewInit{

  markers
  lines
  progress:number = 25


  constructor(
    private _fetchData : FetchDataService
  ) { }

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
  
  incrementProgress(){
    this.progress+=10;
    console.log(this.progress)
    if(this.progress>100){
      this.progress=10
    }
    
  }

}

    