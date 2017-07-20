import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http,Response,Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class EntityService {
	apiURL:string;


	constructor(private _router: Router,private http:Http){
		this.apiURL = localStorage.getItem("apiURL");
	}

	createAuthorizationHeader(headers: Headers) {
		headers.set('Authorization', 'Bearer '+localStorage.getItem("token"))
	}

  get(entity):Observable<any>{
    let headers = new Headers();
		this.createAuthorizationHeader(headers);
		var url = this.apiURL+"/"+entity;
		return this.http.get(url,{headers: headers})
			.map((res:Response)=>res.json());
  }

	add(entity,language)
	{
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		//headers.append('Accept-Language',"de");

		var url = this.apiURL+"/"+entity;
		return this.http.post(url,language,{headers: headers})
		.map((res:Response)=>res.json());
	}

 	handleError(error: Response):Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

	edit(entity,language,id)
	{
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		var url = this.apiURL+"/"+entity+"/"+id;
		return this.http.put(url,language,{headers: headers})
			.map((res:Response)=>res.json());
	}

	delete(entity,id:number)
	{
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		var url = this.apiURL+"/"+entity+"/"+id;
		return this.http.delete(url,{headers: headers})
			.map((res:Response)=>res.json());
	}

	read(entity,id:number)
	{
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		var url = this.apiURL+"/"+entity+"/"+id;
		return this.http.get(url,{headers: headers})
			.map((res:Response)=>res.json());
	}
}
