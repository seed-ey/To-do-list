import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { User } from './signup';
// import { JsonTableService } from '../json-table/services/json-table.service';





@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public signupForm !: FormGroup;
  constructor(
    private formBuilder : FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute,
    // private jsonTableService: JsonTableService,
    ) {
      
     }
     editedUser: any 
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['editedUser']) {
      this.editedUser = JSON.parse(params['editedUser'])``;
      this.signupForm = this.formBuilder.group({
      fullname:[this.editedUser.fullname],
      email:[this.editedUser.email],
      password:[this.editedUser.password],
      mobile:[this.editedUser.mobile]
    });

  } else {
    this.signupForm = this.formBuilder.group({
      fullname: [''],
      email: [''],
      password: [''],
      mobile: [''],
    });
  }
});
}  

buttonFunc() {
  if(this.editedUser && this.editedUser.id) {
    this.editUser()
  } else {
    this.signUp()
  }
}

  signUp(){
    console.log("this.signupForm.value",this.signupForm.value)
    this.http.post<any>("http://localhost:3000/users", this.signupForm.value)
    .subscribe(res=>{
      debugger
      alert("Signup successfully");
      this.signupForm.reset();
      this.router.navigate(['login']);
      console.log(this.signupForm.errors); 

    },err=>{
      alert("something went wrong")
    }); 
  }
  editUser() {
    console.log('this.signupForm.value', this.signupForm.value);
    console.log(this.editedUser.id)
    this.http
      .put<any>(`http://localhost:3000/users/${this.editedUser.id}`, this.signupForm.value)
      .subscribe(
        (res) => {
          debugger;
          alert('User edited successfully');
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        (err) => {
          alert('something went wrong');
        }
      );
  }
}

