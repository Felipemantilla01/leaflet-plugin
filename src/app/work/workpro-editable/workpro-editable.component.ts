import { Component, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, ElementRef } from '@angular/core';
import * as L from 'leaflet'
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogNodeComponent } from './dialog-node/dialog-node.component';

require('../../libs/offset')
require('../../libs/curve')


export interface Icache {

  firstPoint: {
    marker: any,
    point: number
  },
  secondPoint: {
    marker: any,
    point: number
  }
}

@Component({
  selector: 'workpro-editable',
  templateUrl: './workpro-editable.component.html',
  styleUrls: ['./workpro-editable.component.scss']
})


export class WorkproEditableComponent implements AfterViewInit, OnChanges, OnInit {

  @Output() guardar = new EventEmitter<any>()
  @Input('markers') InputMarkers: any
  @Input('lines') InputLines: any
  @Input('progress') Progress: number
  @Output() accion = new EventEmitter<any>()

  /** @Variables_de_marcadores : deben venir de un servicio que se encargue de obtener los procesos */
  // private data= [
  //   {title:'proceso # 1', img:'https://i.redd.it/b3esnz5ra34y.jpg', id:'proceso_1', lat:500 , lng:500},
  //   {title:'proceso # 2', img:'https://cdn.blackmilkclothing.com/media/wysiwyg/Wallpapers/PhoneWallpapers_FloralCoral.jpg', id:'proceso_2', lat:500 , lng:500},
  //   {title:'proceso # 3', img:'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', id:'proceso_3', lat:500 , lng:500},
  //   {title:'proceso # 4', img:'data:image/png;base64,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', id:'proceso_4', lat:500 , lng:500}
  //   {title:'felipe', img:'', id:'proceso_1', lat:500 , lng:500},
  //   {title:'proceso # 2', img:'https://cdn.blackmilkclothing.com/media/wysiwyg/Wallpapers/PhoneWallpapers_FloralCoral.jpg', id:'proceso_2', lat:500 , lng:500},
  //   {title:'mantilla # 3', img:'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', id:'proceso_3', lat:500 , lng:500},
  //   {title:'proceso # 4', img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAA6lBMVEX///+Mxj8bQHU6ws8nXKv+/v/8/vr7/v79/vzy9Pf5+vv6/ff3+/GQyEX4+/P1/P3o+Pm93pDx+OfJ7vLZ8/ZJx9JXy9br8PeazVfY7L5r0dvl8tSr1XLM1ODg5eze9fd+1+CT3eR+ns0zZbCu5uuv13rU6rjf78q224Wfz1+quMxBYIwnSnydrcTZ3+gyU4LS3e5skMaTrdXp9NpfhsG+zubH46FBcLXN5qtUfr3D4Zupvt5/lLJthaa2wtNSbpa96u/F1OmuwuBYgb6XsddKdriEo886a7NfeZ6GmrZxiKlHZY+gr8am5Olfn5lnAAALi0lEQVR4nN1daVvaShhlFQhSqMjihlB3RandrK1arN2s1///d25IEJLJvNtkQqrnW30U5nTmnHeZSSaTsYtGc3ewPrb8oYvH6nrexXraw4iL1XbeQz3tgcTD9pRGezvtkcRCvT+lsZr2SGKh9PgiaGSaLY9Gq5n2QOLhaVXtpj2QmGj6NPrP3KtK/ZdgVW7oaL2IVZXxzardSHscMVFffxnTsd16EdORGXvTMUh7GLEx8Hg88xDouq4nj/Yzjx2uzL1Md1BMexxxUW+9iGWVaUx4tJ69W2UaXjlbSnsYsdF4Ga7r8xgrP3R+fOxV0hiNOTweah34dqfgYuf869tnw2aic1XmxV+FAC7f3XbSGZsEE99Vo2DnZ0HB93QGJ0CpHbWrjyqNQuGfn5Gim5f0wz9y3kR5FFIZnAT9iO12LjQ8ztMZHR+7ER63GhqFwsd0hsfGqsqj+E7LI55Eqgebe+9jjZNCXeXhfNDzKJjnxC6L7AS1z8txhwui2FZ4dH4DPN4YfkN5w2fhY3OjHH/QOgwUv3oL0DCVyMrrrILapySmZVWJH99BHiYSqa51VRoejg5sT0u91Q7yCCclYeyIP3zlUMvCx+sVeyxcrLeCeUnxHOYhlUj54AihMUF3rWqNRzMfzBOdS4RH4VbywdX9GkHDw6ElQ66HyvNKJEkMTYjAfJe/cFj407K/ZIFI/zHwD9B2PYG85X8qKo0IjizwWA1uN3d2EB7nDp/GnoRGtmbDioMFCMqDX4esbNJjD+HAAo/dQGHbQ2hcsAOIcDZcvLbAox7ITHrIfLBVviymke3aiIsBoWM8uIlJNZKKMGAjKDbmm4OIPrjLaumTAY3svgUemTGHB9et1ljhT8WeDR6NWYpVgePHV95nvddnhhRqNkJhZrawHF117oEZBA007sNKejKLIMW7ePIofzakkf1sg8ecCJjv8uSxYbaqXGxa4TETCNBmKBR+caJH1XRVuQJ5ZZWIppvog5WUmHmVjw0rPJ4AJiYcmS9ThRMGG6nJHBUggOxwZG4s8gmO7JbsQEF4wdgLWYkzHdms3TYK0Gi4ZNhVrOnIZtes8tD3dwt3NI9Y6nCN10YNMkdFz+Octt21OCy6+3Z8dwYgotM7B1VpDRiE5WbWBF+1POgi6r157OiuWckSw+gY8uD3eVQktKegbWGRvcRXxir/ktB2gnZhkTw2DJdVzUoTTgetY5HrynBZda133ufQbUlRvmvoVl27QSMM3V7OB4LHitGyOrKb5KrQFLdUXmIUBBOdjYy2CLkgeJjII2kamWI0ed/B890lA3nU1pKT+BSaXUK8/lg2qMs/JWW4c2gmBK8HDZKSQ8uJoRZRheBtOLnMj+xnhjpELAsP6OISqpa0xqeIxJBLNICIW+xfkheHD7Uht4MZb1nat1rQqnLhqBNyhvyy1HZrdmtxFKrUMaEvCZP2PXv7/zSUAherbF/Jwkct2bRKgbKyfiMCEYbB14sSuQ/FsxCByHjUkj0bF0W4+f4D/sVlUTg/XOx0ZJRo+BP+PRGPRYXAAMISgVPFVxIem4s0qyk6vIUl8isrW8xSBLV+Af5WVcCju7BQHkKwFAEdqyyIg4fy6ol/zghBoJ0F5rwSHvKUpHOVG15txX4YJeC+4H8MP7+SL6vedc7H6PQs1szMt3bAzU5+3r4nDR69P7kgvh33jInMHqX4DRUh/DpKut+v0PBxfWO2ymbFCHRi9IBLQ5oidnQ0/FV2vyVfZU+tUsh6V7g8urLmeuUvRMPHyWlPRuaJCNA2YQf0TZHrOqc4DR9/JR95h04I23i/SL4zczPk8MiJlH+HKoR7XFeUlJydsGjkriQfOj0hAJzW32fykMi8ck1T8DCUacQnoq/T3/No1CRR8D8mjVxuS8RjunOote4qT+gSu+KuKhffZDx8jegbDrzM5IhfezhXbBq5nDQsfgC9lycQge1u8bzKx6mQh5+i6LITXiTcY/NwwECuw0j8ON0kafyl+XmZVUodsr9HNB25HNbt1OMHsLJYO2vsQ28O13OnEMV0H9/1hQhrYbF5CKdDGkI83BYKd9GfshYWl0fpXkYjl7uR85g0HzTRkFODcHl0+LFjCmkI8b9GJ5FlizxupDRyOaMnmR1dWGeEQqZfOUTZoYM4hPjQvCRgg+bBfDyiM5LzGBm+TubDpfoThtKZ8dxgWZmEEB/vIu0sOjc54nVLxG41wbUhj8yt2vBdIpPeLitPdL6Z8MgZN7d6aj+LtF7eA489A3m4AhFWIQE4CpElcmGxtqK2TGicmNNwoTyMR04Iq7vLLwTneDCV+RTheFimFPKJ85mSCsoSDdfrQ/+iDsxwAois9LBEI5MJB3YihnQZxuuIk6sYEg8gVItRjROGYVWkdjU0SXYpJkRHjrFZ2xHWHrl7KxtWCqo4D0bGeyak8SeZ91rhUmc8BiXkYUccGuD5Oy0QYRhMZFVNgK8sOhLKeJyY77NRQAsR+gFUGY//EqOBb3vWyJRXxOMh0ZfXYekJ6bwinRuWs0xgPQdyYfUENEbJqcMDJhHKsSRx8Cops3oCksFTW+gVAY+kYscc8JFe6mUlgjzxZAGvQIUzX2qTkF+eXy3ildTGSud34WwluijKIBFit5Nd1w4TdqspwASFaI+yA+HDgt4QDBLBrbfD5XG9qFdrQ0TwCWEbVrLBPAioo4UrhLupthCZ+wDEjlvWMZNH8lEwAH3OiDYWmRkW166arfag2YitJW192MX+osQTyJCXszf8y1ry+bhstLkWeoKJt3EwYtluaZAPYcLGkIi2qYXVU7wShMdj3Mpr0H40ub9MZ1uY1B1WK47Fo76uo6G7SIAFTfqLFYashcXiMYZo5FsmPHSVFbKyWI41ZPCAp8NwQjSJPPZaUY5jcfyqCdPItwzNK3JaGfEs1pYtHT+m964BML43Sz0eC6cnDqe4peN5o43xyBtHE/VUEFzicpR+TH4ftqziTIjao4MlUmHwuCe/bYDzMJ8QN5aE9A7vIzB2Cf9Q34XLw8Uj9QkYQuEd7FszJmREda/quDziTYiL4LtUwcyXoRDKeBvanMTahGRCzgWZlkPzoAqpbYpG/MuHAy1gqFqnyynqhP4qzSP+tVPzsAi9OoOMIZRACNu1MiGZgAcDROj0nYjoHB427gGbPf8CECE7i0THhLGuLF3P/fSotF4jpNRP8AYvh0ff0j15G5hrka1F/GBJg6axbu+6P79+15dVVFTHHatOxg+791p7hzn0Z5ooz0Idq0TG84Hl1uomlDRS6Qme8yLVoD8d1m9L96xLV+kSEhmiSn+k1JHAHauTRFgnEiLPQnMTyrCSuUSy2tV2g/B9tiG2wimhjxPh4THRGDCudVQhhECSuyu2ehTdHCniKwuzLLh95cG6zANYir5VCo/rWAyppzUfE5QjL6PA3RfLFvHKdpwgiwnKqnGhREbIJ+GpyQIuvVUyR5QIlvaiSm8nSmGK8OJCNYKsLLy2TeNSaIwIEtXRCUnlNmWkeY08r4ZbViq3WyMpCiIRNMlK53prJGlEmtZocpLOtemI2mGt4967wNEHAT9VAW9PodnJOvhnyQLuBsFE0KjeX9zYw3iQE0ElspBoqAO4DQoSKaISsdPDMgHkwKDYSziR/gLHHgZQJYL2SxBJPPUFARw3AzfbiKUVa7cwHhyt4OEsnuzKWWwuylDUdrLBbSpq29NFe5wSF92JAXBtMTaovHkZ7I6bxsebTKF7hQ5owGSndIbHFMy4EvFhcE+atSeSz7fGqWT07qzcKE4M9rWoZukE/SQ7QiQqx6EDaGAsofTeHqcW4Gfo3Qfaj2DzF8uA27vps/DROZ6tsXuocq8Dk9Jv/issfDhn9/4iG4F7b6Wmks/HOEuaLCpnp5OZeUCK3vp2c/fx8XF3vNr4tyYigmLl7Obq2328t8X+Q6j0ehWnWEzgWaT/AbKmAttIurg9AAAAAElFTkSuQmCC', id:'proceso_4', lat:500 , lng:500}
  // ]




  markersBasic = []// json for sendInfo to the backend
  linesBasic = {
    lines: [],
    on: {}
  }
  // json for sendInfo to the backend

  workArea
  markers = {}
  lines = {
    on: {

    }
  }
  realtions = {}

  firstPoint
  secondPoint
  cache = {
    firstPoint: {
      marker: null,
      point: 0
    },
    secondPoint: {
      marker: null,
      point: 1
    },
    line: {
      id: null
    }
  }
  temporalLine



  constructor(
    private _snackBar: MatSnackBar,    
    public dialog: MatDialog
  ) { }

  openDialog(): void {

    let marker = {
      title: null,
      id: null,
      lat: 500,
      lng: 500,
      img: 'data:image/png;base64,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',
      active: false,
      current: false,
      action: 'insert'
    }
    let number = Object.keys(this.markersBasic).length
    let title = `Etapa ${number + 1}`


    
    // marker.title = prompt('Titulo de la etapa', `Etapa # ${number + 1}`)
    // if (!!marker.title) {
    //   marker.id = `etapa_${number + 1}`
      let id = uuidv4()
      id = id.replace(/-/g, '')
    //   // console.log(marker)
    //   this.addNewMarker(marker, marker.id)
    // }



    marker.id = id;
    marker.title = title;

    const dialogRef = this.dialog.open(DialogNodeComponent, {
      width: '500px',
      data: marker
    });

    dialogRef.afterClosed().subscribe(marker => {
     if(!!marker)
     {
      this.addNewMarker(marker, marker.id)
     }
    });
  }


  ngOnInit() {
    // let bar: any = document.getElementsByClassName('bar')[0]
    // bar.style.width = `${this.Progress}%`
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['InputLines'] || changes['InputMarkers']) {
      if (!!this.InputLines && !!this.InputMarkers) {
        // console.log(this.InputMarkers)
        // console.log(this.InputLines)

        /** eliminar marcadores existentes */
        let keys = Object.keys(this.markers)
        // console.log(keys)
        keys.forEach(key => {
          this.markers[key].remove()
        });
        this.markersBasic = []
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

    if (changes['progress']) {
      // let bar:any = document.getElementsByClassName('bar')[0]
      // bar.style.width = `${this.Progress}%`
    }

  }
  ngAfterViewInit() {
    this.initMap() //inicializamos el mapa 


  }

  initMap() {
    this.workArea = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 0,
      dragging: false,
      doubleClickZoom: false
    })
      .on('zoomend', () => {
        var currentZoom = this.workArea.getZoom();
        currentZoom = currentZoom.toString()

        let cards = document.getElementsByClassName('card-work-editable')
        var arr = Array.prototype.slice.call(cards)

        arr.forEach(card => {
          card.classList.remove('zoom-1')
          card.classList.remove('zoom-2')
        });

        arr.forEach(card => {
          card.classList.add(`zoom${currentZoom}`)
        });



        // console.log(cards)
      })


    var imageUrl = 'https://fotomuralesmexico.com/wp-content/uploads/2018/07/FONDO-GRIS-TRANSPARENTE-CON-EL-PATR%C3%93N-BLANCO-EN-ESTILO-BARROCO.-VECTOR-ILUSTRACI%C3%93N-RETRO.-IDEAL-PARA-IMPRIMIR-EN-TELA-O-PAPEL-300x300.jpg'
    var bounds = [[0, 0], [1000, 1000]];
    var image = L.tileLayer(imageUrl, bounds, {
      dragg: false
    }).addTo(this.workArea);

    this.workArea.fitBounds(bounds);

    this.workArea.on('mousemove', (event) => {
      let cursorLatLng = event.latlng
      if (this.temporalLine) {
        this.temporalLine.setLatLngs([this.firstPoint, cursorLatLng])
      } else {
        if (this.firstPoint) {

          this.temporalLine = L.polyline([this.firstPoint, cursorLatLng], { className: 'line' }).addTo(this.workArea)
            .bindTooltip("<kbd>Esc</kbd> para cancelar", {
              className: 'tooltip-line',
              direction: 'center'
            })
        }
      }

    })

    this.workArea.on('keydown', (event) => {
      //  console.log(event)
      if (event.originalEvent.keyCode === 27) {
        this.firstPoint = null
        this.secondPoint = null
        if (this.temporalLine) { this.temporalLine.remove() }
        this.temporalLine = null
      }
    })

    /** eliminando attribution leaflet */

    let leflet: any = document.getElementsByClassName('leaflet-control-attribution')[0]
    leflet.style.display = 'none'

    /**progress bar*/



    //  console.log(leflet)
  }

  addNewMarker(marker, id: string) {
    /** CREANDO EL ICONO PARA EL MARCADOR */

    // console.warn(marker)
    this.markersBasic.push(marker)

    var icon = L.divIcon({

      iconSize: null,
      className: 'text', //card?      
      html: `
      <div class="card 1 card-work-editable ">      
      
    <div class="card_image"> <img src="${marker.img}"' /> </div>
    <div class="card_title ">
      <p>${marker.title}</p>
    </div>

  </div>
  `,

    });

    /** CREANDO EL MARCADOR Y POSICIONANDOLO */
    this.markers[id] = L.marker([marker.lat, marker.lng], {
      draggable: true,
      icon: icon,
    })

      .addTo(this.workArea)

      /** tooltip */
      .bindTooltip(
        `
        <div style='display:flex; justify-content: center; align-items: center; padding-left:20px;  padding-right:20px'>
        <img src="../../../assets/modelador/izq.png" style='width:20px; margin-right:10px' alt="Click izquierdo para"> 
        <p>Conectar</p>
        </div>


        <div style='display:flex; justify-content: center; align-items: center; padding-left:20px;  padding-right:20px'>
        <img src="../../../assets/modelador/der.png" style='width:20px; margin-right:10px' alt="Click izquierdo para"> 
        <p>Eliminar</p>
        </div>

        `, {
        className: 'tooltip-marker',
        direction: 'bottom'
      })

      //.openTooltip()
      /**events */

      .on('click', (event) => {

        // console.log('before', this.firstPoint, this.secondPoint)
        this.secondPoint = this.firstPoint ? this.getSecondPoint(id) : null

        this.firstPoint = this.firstPoint ? this.firstPoint : this.getFirstPoint(id)
        // console.log('after', this.firstPoint, this.secondPoint)


        // console.log(!!this.firstPoint)
        // console.log(!!this.secondPoint)

        if (!!this.firstPoint && !!this.secondPoint) {
          /** create line and save in the marker component  */


          /** actualizando action en los marcadores asociados */
          this.markersBasic.forEach((marker, index) => {
            if (marker.id == this.cache.firstPoint.marker || marker.id == this.cache.secondPoint.marker) {
              

              if(this.markersBasic[index].action != 'insert'){
                this.markersBasic[index].action = 'update'
              }

            }
          })

          //console.log('creating line')
          this.drawLine()
          this.temporalLine.remove()
          this.temporalLine = null
          this.firstPoint = null
          this.secondPoint = null
          this.cache = {
            firstPoint: {
              marker: null,
              point: 0
            },
            secondPoint: {
              marker: null,
              point: 1
            },
            line: {
              id: null
            }
          }

        }


      })

      .on('contextmenu', (event) => {
        // console.log(event.target)
        // event.target.bindPopup(
        //   `
        //   <button class='btn-eliminar'><strong> Eliminar</strong></button>
        //   `
        // ).openPopup();

        let confirmation = confirm('¿Está seguro de eliminar la etapa?')
        if (confirmation) {
          // event.target.remove()
          // console.log(this.markersBasic)
          // console.log(this.markers)

          Object.keys(this.markers).forEach(key => {

            if (this.markers[key] === event.target) {

              this.markersBasic.forEach((marker, index) => {
                if (marker.id === key) {


                  if (this.lines.on[key]) {
                    if (this.lines.on[key].length == 0) {
                      this.markersBasic[index].action = 'delete'
                      event.target.remove()
                    }
                    else {
                      alert('Para eliminar la etapa deben eliminar primero los enlaces asociados.')
                    }
                  } else {
                    this.markersBasic[index].action = 'delete'
                    event.target.remove()
                  }


                  // if(this.lines.on[key]==un || this.lines.on[key]==[]){
                  //   console.log(this.lines.on[key])
                  //   alert('Para eliminar la etapa debe eliminar primero los enlaces asociados.')
                  // }

                  // this.lines.on[key].forEach(element => {
                  //   console.log(element.line.id)
                  //   this.lines[element.line.id].remove()
                  //   console.log(this.linesBasic)
                  // });


                }

              })

            }
          })
        }

      })
      .on('drag', () => {
        let markerLatLang = this.markers[id].getLatLng()//this 'id' reference id of the marker

        if (this.lines.on[id]) { //proceso para mover las lineas asociadas al marker 
          this.lines.on[id].forEach(element => {

            let keysArray = element.line.id.split('-')

            if (keysArray[0] === keysArray[1]) {
              this.lines[element.line.id].setLatLng(markerLatLang)
              // console.log(this.lines[element.line.id])

            } else {
              let LatLngs = element.line.latlngs
              LatLngs[element.point] = markerLatLang

              this.lines[element.line.id].setLatLngs(LatLngs)

              /** actualizacion de coordenadas en los demas componentes */
              let otherMarker = element.line.id.replace('-', '')
              otherMarker = otherMarker.replace(id, '')

              this.lines.on[otherMarker].forEach(otherElement => {
                if (otherElement.line.id === element.line.id) {
                  otherElement.line.latlngs = LatLngs
                }
              });
            }

          });
        }

        /** actualizar coordenadas en el basic por si se envia la informacion hacia el backend  */

      })
      .on('dragend', ()=>{

        this.markersBasic.forEach((marker, index)=>{
          if(marker.id == id){

            if(this.markersBasic[index].action != 'insert'){
              this.markersBasic[index].action = 'update'
            }

          }
        })

        console.log(this.markersBasic)
      })



  }
  drawLine() {
    //console.log('Cache', this.cache)

    if (this.firstPoint === this.secondPoint) {
      this.lines[this.cache.line.id] = L.circle(this.firstPoint, { radius: 70, className: 'circle' }).addTo(this.workArea);
      // this.lines[this.cache.line.id] = L.curve(

      //     ['M', [this.firstPoint.lat, this.firstPoint.lng],
      //       'C', [this.firstPoint.lat+10,this.firstPoint.lng+10],
      //       [this.secondPoint.lat+10, this.secondPoint.lng+10],
      //       [this.secondPoint.lat, this.secondPoint.lng],]
      //     , {className:'line' }
      //   )
      //     .addTo(this.workArea);
    }
    else {
      this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], { offset: 15, className: 'line' }).addTo(this.workArea)
    }
    this.lines[this.cache.line.id]


      .bindTooltip(`
      <div style='display:flex; justify-content: center; align-items: center; padding-left:20px;  padding-right:20px'>
        <img src="../../../assets/modelador/der.png" style='width:20px; margin-right:10px' alt="Click izquierdo para"> 
        <p>Eliminar</p>
        </div>
      `, {
        className: 'tooltip-line',
        direction: 'bottom'
      })
      .on('contextmenu', (event) => { //delete the line 

        let lineToDelete = event.target
        let keys = Object.keys(this.lines) //obtenemos las key existentes en el JSON 

        keys.forEach(key => { //verificamos para cada key si la linea almacenada ahi hace match con la linea a eliminar 
          if (this.lines[key] === lineToDelete) {
            //console.log(this.lines)

            let markers = key.split('-') //obtenemos los marker vinculador a la linea a ser eliminada 
            markers.forEach(markerKey => { // recorremos cada marker vinculado

              /** actualizando action en los marcadores asociados  */
              this.markersBasic.forEach( (marker,index)=>{
                if(marker.id == markerKey){
                  if(this.markersBasic[index].action != 'insert'){
                    this.markersBasic[index].action = 'update'
                  }
                }
              })
              // console.log(this.markersBasic)

              let linesOn = this.lines.on[markerKey] // obtenemos las lineas viculadas al marker
              linesOn.forEach((element, index) => { //recorremos cada linea vinculada

                if (element.line.id === key) { // si la linea vinculada tiene id igual a la linea a ser elminada
                  //console.log(linesOn, index)     
                  this.lines.on[markerKey].splice(index, 1) // removemos el objecto del array en el indice encontrado 
                  //console.warn(linesOn, index)
                }
              });
            });

            //delete this.lines.on
            delete this.lines[key] //eliminamos la linea del structure
            lineToDelete.remove() // eliminarmos la linea visualmente
            //console.log(this.lines)
          }
        });
      })


    if (this.lines.on[this.cache.firstPoint.marker]) {
      //console.log(`lines on ${this.cache.firstPoint.marker} exist?`, true)
      this.lines.on[this.cache.firstPoint.marker].push(
        {
          line: {
            id: this.cache.line.id,
            latlngs: [this.firstPoint, this.secondPoint]
          },
          point: 0

        }
      )
    } else {
      //console.log(`lines on ${this.cache.firstPoint.marker} exist?`, false)
      this.lines.on[this.cache.firstPoint.marker] = [
        {
          line: {
            id: this.cache.line.id,
            latlngs: [this.firstPoint, this.secondPoint]
          },
          point: 0

        }
      ]
    }


    if (this.lines.on[this.cache.secondPoint.marker]) {
      //console.log(`lines on ${this.cache.secondPoint.marker} exist?`, true)
      this.lines.on[this.cache.secondPoint.marker].push(
        {
          line: {
            id: this.cache.line.id,
            latlngs: [this.firstPoint, this.secondPoint]
          },
          point: 1

        }
      )
    } else {
      //console.log(`lines on ${this.cache.secondPoint.marker} exist?`, false)      
      this.lines.on[this.cache.secondPoint.marker] = [
        {
          line: {
            id: this.cache.line.id,
            latlngs: [this.firstPoint, this.secondPoint]
          },
          point: 1
        }
      ]
    }

    //console.warn(this.lines)

  }
  getFirstPoint(markerId: string) {

    this.cache.firstPoint.marker = markerId
    return this.markers[markerId].getLatLng()

  }
  getSecondPoint(markerId: string) {
    this.cache.secondPoint.marker = markerId
    this.cache.line.id = `${this.cache.firstPoint.marker}-${this.cache.secondPoint.marker}`
    return this.markers[markerId].getLatLng()

  }

  saveMap() {

    /**Actualizando los datos para enviar los markers con las coordenadas actuales */
    let markerKeys = Object.keys(this.markers)
    markerKeys.forEach(markerKey => {
      let latlng = this.markers[markerKey]._latlng
      this.markersBasic.forEach((markerBasic, index) => {
        if (markerBasic.id === markerKey) {
          this.markersBasic[index].lat = latlng.lat
          this.markersBasic[index].lng = latlng.lng
          //console.log(true, index)
        }
      });
    });

    //console.log(this.markersBasic)

    /** preparando los datos para enviar las lineas */
    //console.log(this.lines.on)

    let linesKeys = Object.keys(this.lines)

    linesKeys.forEach(lineKey => {
      if (lineKey === 'on') {
        this.linesBasic.on = this.lines[lineKey] // esto es innecesario puesto que se puede hacer directamente
      }
      else {
        //console.log(this.lines[lineKey]._latlngs)
        let line: any //= this.lines[lineKey]

        let keysArray = lineKey.split('-')
        if (keysArray[0] === keysArray[1]) {
          // console.log('hola')
          line = {
            id: lineKey,
            _latlngs: this.lines[lineKey]._latlng
          }

        } else {
          line = {
            id: lineKey,
            _latlngs: this.lines[lineKey]._latlngs
          }
        }


        this.linesBasic.lines.push(line)
      }

    });


    /**Exite un arreglo null? si es asi eliminarlo para no almacenarlo en la base de datos  */
    if (this.linesBasic.on['null']) { delete this.linesBasic.on['null'] }

    /** Enviando los datos al componente padre */

    // console.log(this.markersBasic, this.linesBasic)
    this.guardar.emit({ markers: this.markersBasic, lines: this.linesBasic })

    this.openSnackBar('Guardando...', 'Aceptar')


    //  this._fetchData.sendLines(this.markersBasic).subscribe(
    //   res=>console.log(res),
    //   err=>console.log(err)
    // )

    this.linesBasic = {
      lines: [],
      on: {}
    }

    // setTimeout(() => {
    //   this.accion.emit(false)
    // }, 1000);

  }

  cancel() {
    this.accion.emit(false)
  }

  addMarker() {

    this.workArea.setZoom(0)
    this.openDialog()

  }

  reDrawLines(datalines) {
    this.lines.on = datalines.on
    //console.log(datalines.lines)
    //this.lines[this.cache.line.id] = L.polyline([this.firstPoint, this.secondPoint], {className: 'line'}).addTo(this.workArea)

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


      this.firstPoint = null
      this.secondPoint = null
      this.cache = {
        firstPoint: {
          marker: null,
          point: 0
        },
        secondPoint: {
          marker: null,
          point: 1
        },
        line: {
          id: null
        }
      }

    });


  }

  deleteMarker() {
    console.log('delete marker')
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1500,
    });
  }


}
