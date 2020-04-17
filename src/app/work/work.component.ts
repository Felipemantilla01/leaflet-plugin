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


  @Input('editable') Editable:boolean
  @Output() guardar = new EventEmitter<any>()
  @Output() abrirEtapa = new EventEmitter<any>()
  @Input('nodos') markers:any
  @Input('lineas') lines:any
  @Input('progreso') progress:number
  @Input('proceso') process:any


  ngAfterViewInit(){
    this.workproEditDisplay='none'
    this.workproDisplay='inline'
  }

  saveMap($event){
    
    $event.process = this.process
    // console.log($event)
    this.guardar.emit($event)
    setTimeout(() => {
      // document.location.reload()
    }, 1000);
  }
  changeEnvironment($event){
    // console.log($event)
    !$event ? document.location.reload():console.log(true)
    
    setTimeout(()=>{
      this.workproEditDisplay = $event ? 'inline': 'none'
      this.workproDisplay = $event ? 'none': 'inline'    
    }, 500)


  }
  openProcess($event){
    this.abrirEtapa.emit($event)
  }
  
}
