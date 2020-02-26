import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  constructor(
    private _http:HttpClient
  ) { }

  getData(){
    return this._http.get('http://localhost:3000/data')
  }

  sendMarkers(data){
    return this._http.post('http://localhost:3000/data/markers', data)
  }

  sendLines(data){
    return this._http.post('http://localhost:3000/data/lines', data)
  }

  sendData(data){
    return this._http.post('http://localhost:3000/data', data)
  }


}
