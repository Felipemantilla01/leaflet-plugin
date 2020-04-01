import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { FetchDataService } from 'src/app/services/fetch-data.service';

@Component({
  selector: 'modelador',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit {

  workproDisplay='inline'
  workproEditDisplay='inline'


  @Input() editable:boolean=false
  @Output() guardar = new EventEmitter<any>()
  @Output() abrirProceso = new EventEmitter<any>()
  @Input('nodos') markers:any
  @Input('lineas') lines:any
  @Input('progreso') progress:number

  ngAfterViewInit(){
    this.workproEditDisplay='none'
    this.workproDisplay='inline'
  }

  saveMap($event){
    this.guardar.emit($event)
    setTimeout(() => {
      document.location.reload()
    }, 1000);
  }
  changeEnvironment($event){
    // console.log($event)
    this.workproEditDisplay = $event ? 'inline': 'none'
    this.workproDisplay = $event ? 'none': 'inline'    
    !$event ? document.location.reload():console.log(true)
  }
  openProcess($event){
    this.abrirProceso.emit($event)
  }
  
}
