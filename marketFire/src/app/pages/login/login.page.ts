import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;


  @ViewChild('flipcontainer', { static: false }) flipcontainer : ElementRef;
  
  constructor(
    private formBuilder: FormBuilder, 
    private alertCtlr: AlertController, 
    private toastCtlr: ToastController, 
    private loadingCtl: LoadingController, 
    private authService: AuthService,
    private router: Router
    ) { }



  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      role: ['BUYER', Validators.required]
    })

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }


  async register() {
    let loading = await this.loadingCtl.create({
      message: 'Loading'
    })

    await loading.present();

    this.authService.signUp(this.registerForm.value)
    .then(async res => {
      await loading.dismiss();

      let toast = await this.toastCtlr.create({
        duration: 3000,
        message: "Successfully created an account"
      })

      toast.present()
      this.navigateByRole(this.registerForm.value['role'])

    }, async err => {
      await loading.dismiss()

      let alert = await this.alertCtlr.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      })

      alert.present()
    }) 
  }

  navigateByRole(role) {
    if(role == 'SELLER') {
      this.router.navigateByUrl('/buyer')
    } else if(role == 'BUYER') {
      this.router.navigateByUrl('/seller')
    }
  }

  async login() {
    let loading = await this.loadingCtl.create({
      message: 'Loading'
    });

    
    await loading.present();

    this.authService.signIn(this.loginForm.value)
    .subscribe(user => {
      loading.dismiss();

      this.navigateByRole(user['role'])
      console.log("auth user", user)
    }, 
    async err => {
      loading.dismiss();
      let alert = await this.alertCtlr.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      })

      alert.present()
    })
  }

  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip')
  }
}
