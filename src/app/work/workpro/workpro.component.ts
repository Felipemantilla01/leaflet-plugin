import { Component, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet'
export interface Icache {

  firstPoint:{
    marker:any,
    point:number
  },
  secondPoint:{
    marker:any,
    point:number
  }
}

@Component({
  selector: 'workpro',
  templateUrl: './workpro.component.html',
  styleUrls: ['./workpro.component.scss']
})


export class WorkproComponent implements AfterViewInit, OnChanges{

@Input('markers') InputMarkers:any
@Input('lines') InputLines:any
@Input('progress') Progress:number
@Output() abrirProceso = new EventEmitter<any>()
@Output() accion = new EventEmitter<any>()


  markersBasic=[]// json for sendInfo to the backend
  linesBasic={
    lines:[],
    on:{}
  }
  // json for sendInfo to the backend
  
  work
  markers={}
  lines={
    on:{

    }
  }
  realtions={}

  firstPoint
  secondPoint
  cache={
    firstPoint:{
      marker:null,
      point:0
    },
    secondPoint:{
      marker:null,
      point:1
    },
    line:{
      id:null
    }
  }
  temporalLine  

  constructor() {}

  ngOnChanges(changes: SimpleChanges){
    if(changes['InputLines'] || changes['InputMarkers']){
      if(!!this.InputLines && !!this.InputMarkers){
        // console.log(this.InputMarkers)
        // console.log(this.InputLines)
        this.InputMarkers.forEach(element => {
            this.addNewMarker(element,element.id)      
        });

        this.reDrawLines(this.InputLines)
      }      
    }    
  }
  ngAfterViewInit() {
    this.initMap() //inicializamos el mapa 
  }

  initMap(){
    
    this.work = L.map('map-work', {
      crs:L.CRS.Simple,
      minZoom:0,
      maxZoom:0,
      dragging:false
   })

   var imageUrl = 'https://www.vandersandengroup.lt/sites/default/files/styles/brick_thumbnail_2014/public/images_brick_joint/vds_1_350a0_gh_rainbow-wapper_white_02.jpg?itok=mJ5mD6eI'
   var bounds = [[0,0], [1000 ,1000]];
   var image = L.tileLayer(imageUrl, bounds, {
     dragg:false
   }).addTo(this.work);

   this.work.fitBounds(bounds);
   
   /** eliminando attribution leaflet */

   let leflet:any = document.getElementsByClassName('leaflet-control-attribution')[0]
   leflet.style.display='none'

   /**progress bar*/

  //  console.log(leflet)
  }

  addNewMarker(marker,id:string){
    /** CREANDO EL ICONO PARA EL MARCADOR */

    // console.warn(`creating marker ${marker.id}`)
    this.markersBasic.push(marker)

    var icon = L.divIcon({    
 
      iconSize:null,
      className:'text', //card?      
      html:`
      <div class="card 1">      
      
    <div class="card_image"> <img src="${marker.img}" /> </div>
    <div class="card_title title-white">
      <p>${marker.title}</p>
    </div>

  </div>
  `,
    
    });

    /** CREANDO EL MARCADOR Y POSICIONANDOLO */
      this.markers[id]=L.marker([marker.lat, marker.lng], {
      draggable:false,
      icon: icon,
    })    



    .addTo(this.work)
    
    /** tooltip */
    .bindTooltip("Click para abrir Proceso", {
      className:'tooltip-marker',
      direction:'bottom'
    })
    
    // //.openTooltip()
    /**events */    
    .on('click', (event)=>{
      //console.log(marker)
      this.abrirProceso.emit({nodo:marker})
    })

  }
  drawLine(){
    //console.log('Cache', this.cache)
    this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {className: 'line'}).addTo(this.work)    
    //console.warn(this.lines)

  }

  reDrawLines(datalines){
    this.lines.on = datalines.on
    //console.log(datalines.lines)
    //this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {className: 'line'}).addTo(this.work)

    datalines.lines.forEach(line => {
      
      this.cache.line.id = line.id
      this.firstPoint = line._latlngs[0]
      this.secondPoint = line._latlngs[1]      
      // console.warn(`creating line ${line.id}`)
      this.drawLine()
        
        this.firstPoint=null
        this.secondPoint=null
        this.cache ={
          firstPoint:{
            marker:null,
            point:0
          },
          secondPoint:{
            marker:null,
            point:1
          },
          line:{
            id:null
          }
        }

    });      
  }

  editar(){
// this._router.navigate(['workpro/editar'])
    this.accion.emit(true)
  }


}
