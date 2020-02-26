import { Component, AfterViewInit } from '@angular/core';
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
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})




export class LeafletComponent implements AfterViewInit {
  
/** @Variables_de_marcadores : deben venir de un servicio que se encargue de obtener los procesos */
private data= [
  // {title:'proceso # 1', img:'https://i.redd.it/b3esnz5ra34y.jpg', id:'proceso_1', lat:500 , lng:500},
  // {title:'proceso # 2', img:'https://cdn.blackmilkclothing.com/media/wysiwyg/Wallpapers/PhoneWallpapers_FloralCoral.jpg', id:'proceso_1', lat:500 , lng:500},
  // {title:'proceso # 3', img:'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', id:'proceso_3', lat:500 , lng:500},
  // {title:'proceso # 4', img:'data:image/png;base64,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', id:'proceso_4', lat:500 , lng:500}
  {title:'proceso # 1', img:'', id:'proceso_1', lat:500 , lng:500},
  {title:'proceso # 2', img:'https://cdn.blackmilkclothing.com/media/wysiwyg/Wallpapers/PhoneWallpapers_FloralCoral.jpg', id:'proceso_2', lat:500 , lng:500},
  {title:'proceso # 3', img:'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', id:'proceso_3', lat:500 , lng:500},
  {title:'proceso # 4', img:'data:image/png;base64,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', id:'proceso_4', lat:500 , lng:500}
]


  
  workArea
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

  

  constructor() { }

  ngAfterViewInit() {
    this.initMap() //inicializamos el mapa
    this.data.forEach(element => {
      this.addNewMarker(element,element.id)
    });
    // this.markers['proceso_4'].dragging.disable()    
  }

  initMap(){
    this.workArea = L.map('map', {
      crs:L.CRS.Simple,
      minZoom:0,
      maxZoom:0,
      dragging:false
   })

   var imageUrl = 'https://www.vandersandengroup.lt/sites/default/files/styles/brick_thumbnail_2014/public/images_brick_joint/vds_1_350a0_gh_rainbow-wapper_white_02.jpg?itok=mJ5mD6eI'
   var bounds = [[0,0], [1000 ,1000]];
   var image = L.tileLayer(imageUrl, bounds, {
     dragg:false
   }).addTo(this.workArea);

   this.workArea.fitBounds(bounds);

   this.workArea.on('mousemove', (event)=>{
    let cursorLatLng = event.latlng    
    if(this.temporalLine){      
      this.temporalLine.setLatLngs([this.firstPoint, cursorLatLng])
    }else{
      if(this.firstPoint){
        
        this.temporalLine = L.polyline([this.firstPoint, cursorLatLng], {color: 'black'}).addTo(this.workArea)
        .bindTooltip("<kbd>Esc</kbd> para cancelar", {
          className:'tooltip-line',
          direction:'center'
        })
      }
    }
    
   })
   
   this.workArea.on('keydown', (event)=>{
    //  console.log(event)
      if(event.originalEvent.keyCode===27){
        this.firstPoint=null
        this.secondPoint=null
        if(this.temporalLine){this.temporalLine.remove()}
        this.temporalLine=null
      }
   })

  }

  addNewMarker(marker,id:string){
    /** CREANDO EL ICONO PARA EL MARCADOR */
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
      draggable:true,
      icon: icon,
    })    

    .addTo(this.workArea)
    
    /** tooltip */
    .bindTooltip("Click para conectar", {
      className:'tooltip-marker',
      direction:'bottom'
    })
    
    //.openTooltip()
    /**events */    

    .on('click', (event)=>{

      // console.log('before', this.firstPoint, this.secondPoint)
      this.secondPoint = this.firstPoint ? this.getSecondPoint(id)  : null

      this.firstPoint = this.firstPoint ? this.firstPoint : this.getFirstPoint(id)
      // console.log('after', this.firstPoint, this.secondPoint)


      // console.log(!!this.firstPoint)
      // console.log(!!this.secondPoint)

      if(!!this.firstPoint && !!this.secondPoint){
        /** create line and save in the marker component  */
        
        //console.log('creating line')
        this.drawLine()
        this.temporalLine.remove()
        this.temporalLine = null
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



        
      }
      
      
    })

    .on('drag', ()=>{

      
      let markerLatLang = this.markers[id].getLatLng()//this 'id' reference id of the marker
     
      if(this.lines.on[id]){ //proceso para mover las lineas asociadas al marker 
        this.lines.on[id].forEach(element => {        
        
          let LatLngs = element.line.latlngs
          LatLngs[element.point] = markerLatLang
  
          this.lines[element.line.id].setLatLngs(LatLngs)
  
          /** actualizacion de coordenadas en los demas componentes */
          let otherMarker = element.line.id.replace('-','')
          otherMarker = otherMarker.replace(id,'')
  
          this.lines.on[otherMarker].forEach(otherElement => {
            if(otherElement.line.id===element.line.id){
              otherElement.line.latlngs = LatLngs
            }
          });        
        });
      }  
    

    })
  }
  drawLine(){
    //console.log('Cache', this.cache)

    this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {color: 'red'}).addTo(this.workArea)
    .bindTooltip("Click para eliminar", {
      className:'tooltip-line',
      direction:'bottom'
    })
    .on('click', (event)=>{
      
      let lineToDelete =event.target

      lineToDelete.remove()

      
     
      //

    })


    if(this.lines.on[this.cache.firstPoint.marker]){
      console.log(`lines on ${this.cache.firstPoint.marker} exist?`, true)
      this.lines.on[this.cache.firstPoint.marker].push(
        {
          line: {
            id: this.cache.line.id,
            latlngs:[this.firstPoint,this.secondPoint]
          },
          point:0
  
        }
      )
    }else{
      console.log(`lines on ${this.cache.firstPoint.marker} exist?`, false)
      this.lines.on[this.cache.firstPoint.marker] = [
        {
          line: {
            id: this.cache.line.id,
            latlngs:[this.firstPoint,this.secondPoint]
          },
          point:0
  
        }
      ]
    }


    if(this.lines.on[this.cache.secondPoint.marker]){
      console.log(`lines on ${this.cache.secondPoint.marker} exist?`, true)
      this.lines.on[this.cache.secondPoint.marker].push(
        {
          line: {
            id: this.cache.line.id,
            latlngs:[this.firstPoint,this.secondPoint]
          },
          point:1
  
        }
      )
    }else{
      console.log(`lines on ${this.cache.secondPoint.marker} exist?`, false)      
      this.lines.on[this.cache.secondPoint.marker] = [
        {
          line: {
            id: this.cache.line.id,
            latlngs:[this.firstPoint,this.secondPoint]
          },
          point:1
        }
      ]
    }

    console.warn(this.lines)

  }
  getFirstPoint(markerId:string){

    this.cache.firstPoint.marker = markerId
    return this.markers[markerId].getLatLng()

  }
  getSecondPoint(markerId:string){
    this.cache.secondPoint.marker = markerId
    this.cache.line.id = `${this.cache.firstPoint.marker}-${this.cache.secondPoint.marker}`    
    return this.markers[markerId].getLatLng()
    
  }

}
