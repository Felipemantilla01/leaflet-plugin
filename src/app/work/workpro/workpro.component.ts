import { Component, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet'
import { makeBindingParser } from '@angular/compiler';
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
@Output() abrirEtapa = new EventEmitter<any>()
@Output() accion = new EventEmitter<any>()


  colorByProgress:string
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

        /** eliminar marcadores existentes */
        let keys = Object.keys(this.markers)
        // console.log(keys)
        keys.forEach(key => {
          this.markers[key].remove()
        });
        /**fin de eliminar marcadores existentes */

        this.InputMarkers.forEach(element => {
            this.addNewMarker(element,element.id)      
        });

        let linesKeys = Object.keys(this.lines)
        
        if(!(linesKeys.length>1)){
          this.reDrawLines(this.InputLines)
        }

        
      }      
    }
    if(changes['Progress']){
      
      if(this.Progress<50){        
        this.colorByProgress=`rgb(255,${this.Progress*4+40},51)`
      }
      else{        
        this.colorByProgress=`rgb(${300-this.Progress*2},255,51)`
      }

      //console.log(this.colorByProgress)

      
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
      dragging:false,
      doubleClickZoom:false
   })
   .on('zoomend', ()=>{
    var currentZoom = this.work.getZoom();
    currentZoom = currentZoom.toString()

    let cards = document.getElementsByClassName('card-work')
    var arr = Array.prototype.slice.call( cards )
    
    arr.forEach(card => {
      card.classList.remove('zoom-1')
      card.classList.remove('zoom-2')
    });

    // this.work.setZoom(0)

    arr.forEach(card => {
      card.classList.add(`zoom${currentZoom}`)
    });

    // console.log(cards)
  })

   var imageUrl = 'https://fotomuralesmexico.com/wp-content/uploads/2018/07/FONDO-GRIS-TRANSPARENTE-CON-EL-PATR%C3%93N-BLANCO-EN-ESTILO-BARROCO.-VECTOR-ILUSTRACI%C3%93N-RETRO.-IDEAL-PARA-IMPRIMIR-EN-TELA-O-PAPEL-300x300.jpg'
   var bounds = [[0,0], [1000 ,1000]];
   var image = L.tileLayer(imageUrl, bounds, {
     dragg:false,
     noWrap: true,
    continuousWorld: true,

   }).addTo(this.work);



   this.work.fitBounds(bounds);
   
   /** eliminando attribution leaflet */

   let leflet:any = document.getElementsByClassName('leaflet-control-attribution')[1]
   leflet.style.display='none'

   /**progress bar*/

  //  console.log(leflet)
  }

  addNewMarker(marker,id:string){
    /** CREANDO EL ICONO PARA EL MARCADOR */
    
    var activeClass
    var currentClass
    // console.log(marker)
    if(marker.active){
     activeClass = 'active' 
    }else{
      activeClass = 'inactive' 
    }
    if(marker.current){
      currentClass = 'current'
    }else{
      currentClass = ''
    }


    // console.warn(`creating marker ${marker.id}`)
    this.markersBasic.push(marker)


    var icon = L.divIcon({    
 
      iconSize:null,
      className:'text', //card?      
      html:`
      <div class="card ${activeClass} ${currentClass} card-work ">      
      
    <div class="card_image"> <img src="${marker.img}" alt="No image"/> </div>
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
    if(marker.active){
      this.markers[id].bindTooltip("Click para abrir etapa", {
        className:'tooltip-marker',
        direction:'bottom'
      })      
    }else{
      this.markers[id].bindTooltip("Etapa bloqueada", {
        className:'tooltip-marker',
        direction:'bottom'
      })
      
    }
    
    // //.openTooltip()
    /**events */    
    this.markers[id].on('click', (event)=>{

      if(marker.active){
        this.abrirEtapa.emit({nodo:marker})
      }
      //console.log(marker)
      
    })

  }
  drawLine(){
    //console.log('Cache', this.cache)
    if(this.firstPoint===this.secondPoint){
      this.lines[this.cache.line.id] = L.circle(this.firstPoint, {radius: 85, className:'circle'}).addTo(this.work);
    }
    else{
      this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {offset:15,className: 'line'}).addTo(this.work)
    }
    this.lines[this.cache.line.id]
    //console.warn(this.lines)

  }

  reDrawLines(datalines){
    this.lines.on = datalines.on
    //console.log(datalines.lines)
    //this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {className: 'line'}).addTo(this.work)

    datalines.lines.forEach(line => {
      let keysArray = line.id.split('-')

      if (keysArray[0] === keysArray[1]) {
        this.cache.line.id = line.id
        this.firstPoint = line._latlngs
        this.secondPoint = line._latlngs
      } else {
        this.cache.line.id = line.id
        this.firstPoint = line._latlngs[0]
        this.secondPoint = line._latlngs[1]
      }
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
