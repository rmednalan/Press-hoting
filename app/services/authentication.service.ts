import {Injectable,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {Http,Response,Headers} from '@angular/http';

import {User} from '../class/user';
import {Observable} from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class AuthenticationService {
  public check_url = localStorage.getItem("apiURL")+"/countries";
  public needsAuthentication = true;
  public confirm = new EventEmitter<boolean>();

  constructor(private _router: Router,private http:Http){}

  public authenticate(): Observable<boolean> {
      // do something to make sure authentication token works correctly
      if (this.needsAuthentication) {
        return Observable.create(observer => {
          this.confirm.subscribe(r => {
            this.needsAuthentication = !r;
            observer.next(r);
            observer.complete();
          });
        });
      }
      else {
        return Observable.of(true);
      }
  }

  createAuthorizationHeader(headers: Headers) {
		headers.set('Authorization', 'Bearer '+localStorage.getItem("token"));
	}


  public getToken(url: string): Observable<Response> {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.authenticate().flatMap(authenticated => {
      if (authenticated) {
        return this.http.get(url,{headers:headers});
      }
      else {
        return Observable.throw('Unable to re-authenticate');
      }
    });
  }

  logout() {
    localStorage.clear();
    this._router.navigate(['login']);
  }

  login(user,url):Observable<any>{

	console.log(url);
	const new_url = url+"/adminLogin";

	return this.http.post(new_url,{"username":user.username,"password":user.password})
	.map((res:Response)=>res.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

   checkCredentials(){

    if (localStorage.getItem("token") === null){
        this._router.navigate(['login']);
    }

    this.getToken(this.check_url).subscribe(() => {
       alert('Data retrieved!');
     }, err => {
       this.logout();
     });
  }

	isLoggedIn()
	{
		if (localStorage.getItem("token") === null){
			return false;
		}else
		{
			return true;
		}
	}
}
