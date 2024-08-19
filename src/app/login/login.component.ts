import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from './login.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string | null = null; // เก็บข้อความข้อผิดพลาด

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // สร้างฟอร์มเข้าสู่ระบบ
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  onLogin(): void {
    if (this.loginForm.invalid) {
      // ตรวจสอบว่าแบบฟอร์มไม่ถูกต้อง
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      response => {
        if (response && response.user && response.token) {
          const userId = response.user.user_id;
          console.log('User ID from login:', userId);

          localStorage.setItem('userId', userId.toString());
          localStorage.setItem('token', response.token);

          // หรือใช้บริการเพื่อเก็บ userId
          this.authService.setUserId(userId);

          // นำทางไปยังหน้าหลักหลังจากเข้าสู่ระบบสำเร็จ
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง';
        }
      },
      error => {
        // แสดงข้อความข้อผิดพลาดหากเข้าสู่ระบบไม่สำเร็จ
        console.error('Login failed', error);
        this.errorMessage = 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง';
      }
    );
  }

  // ฟังก์ชันสำหรับเปลี่ยนการแสดงรหัสผ่าน
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // ฟังก์ชันสำหรับลืมรหัสผ่าน
  onForgotPassword() {
    // จัดการกรณีลืมรหัสผ่าน
  }

  // ฟังก์ชันสำหรับเปิดหน้าต่างลงทะเบียน
  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '400px'
    });
  }
}
