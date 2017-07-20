import {Component,ElementRef,OnInit,Input} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../services/authentication.service';
import {EntityService} from '../services/entity.service';
import {ConfigService} from '../services/config.service';
import {User} from '../class/user';


@Component({
	selector:'press-login',
    templateUrl: 'app/login/login.component.html',
	styleUrls:  ['app/login/login.component.css',]
})

export class LoginComponent implements OnInit {
	public user = new User('','');
    public errorMsg = '';
    errorMessage:string;
	apiURL:string;

	constructor(
		private _service:AuthenticationService,
		private _router: Router,
		private _config:ConfigService
	) {}

	login(url) {
		this.errorMsg = "";//reset
		if(this.user.username == "")
		{
			this.errorMsg += 'Username is required. <br />';
		}

		if(this.user.password == "")
		{
			this.errorMsg += 'Password is required. <br />';
		}

		if(this.errorMsg == "")
		{
			this._config.getApiURL().subscribe(theApiURL=>{
				console.log(theApiURL);
				this.apiURL = theApiURL.apiUrl;
				localStorage.setItem("apiURL",this.apiURL);

				this._service.login(this.user,this.apiURL).subscribe(
					response=>{
						console.log(response);
						if(response.success === false)
						{
							this.errorMsg = 'Login Failed';
						}else
						{
							this.errorMsg = '';
							this.user.username = "";
							this.user.password = "";
							localStorage.setItem("token",response.Authorization);
							this._router.navigate(['/dashboard']);
							location.reload();
						}

					},
					error=>{
						alert("something went wrong!");
					}
				);
            },err=>{
				console.log(err);
				this.user.username = "";
				this.user.password = "";
            });
		}


    }

	ngOnInit() {
		if(this._service.isLoggedIn())
		{
			this._router.navigate(['dashboard']);
		}
	}
}
