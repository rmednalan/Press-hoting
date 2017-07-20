import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class Config {
    private _config: Object;
    private _env: Object;
}

@Injectable()
export class ConfigService {
    private configUrl = 'app/config/development.json';  // URL to web API

    constructor (private http: Http) {}

	getApiURL():Observable<any>{     
      return this.http.get(this.configUrl).map((res:Response)=>res.json())
                .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}

}
