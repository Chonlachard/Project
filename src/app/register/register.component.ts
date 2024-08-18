import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: RegisterService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?\\d{10,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;
      const userData = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        phone: formValues.phoneNumber,
        email: formValues.email,
        password: formValues.password
      };
  
      this.authService.register(userData).subscribe(
        response => {
          console.log('Registration successful', response);
          this.openSnackBar('ลงทะเบียนสำเร็จ', 'ปิด', 'success-snackbar');
          this.dialogRef.close(); // ปิด Dialog หลังจากสมัครสมาชิกสำเร็จ
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration failed', error);
          let errorMessage = 'การลงทะเบียนล้มเหลว กรุณาลองอีกครั้ง';
          if (error.status === 409) {
            errorMessage = 'อีเมลนี้มีอยู่แล้ว';
          }
          this.openSnackBar(errorMessage, 'ปิด', 'error-snackbar');
        }
      );
    }
  }
  

  openSnackBar(message: string, action: string, panelClass: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass],
    });
  }

  onLogin(): void {
    if (this.registerForm.valid) {
      const { firstName, lastName, phoneNumber, email, password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        this.openSnackBar('Passwords do not match', 'Close', 'error-snackbar');
        return;
      }
  
      const userData = {
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        email: email,
        password: password
      };
  
      this.authService.register(userData).subscribe(
        response => {
          console.log('Registration successful', response);
          this.openSnackBar('Registration successful', 'Close', 'success-snackbar');
          this.dialogRef.close(); // ปิด Dialog หลังจากสมัครสมาชิกสำเร็จ
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration failed', error);
          let errorMessage = 'Registration failed. Please try again.';
          if (error.status === 409) {
            errorMessage = 'Email already exists';
          }
          this.openSnackBar(errorMessage, 'Close', 'error-snackbar');
        }
      );
    }
  }
}