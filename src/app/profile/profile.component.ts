import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  newPassword: string = '';
  confirmPassword: string = '';
  userId: string = ''; // ดึง userId จาก local storage หรือบริการที่เกี่ยวข้อง

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || ''; // ดึง userId จาก local storage
    this.loadProfile();
  }

  loadProfile(): void {
    if (this.userId) {
      this.profileService.getProfile(this.userId).subscribe(profile => {
        console.log('Profile loaded:', profile);

        // Mapping API response to form fields
        this.profileForm.patchValue({
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          email: profile.email
        });
      }, error => {
        console.error('Error loading profile', error);
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }

  updateProfile(): void {
    Swal.fire({
      title: 'ยืนยันการอัปเดตข้อมูล?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการอัปเดตข้อมูลโปรไฟล์นี้?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, อัปเดต!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.profileForm.valid) {
          this.profileService.updateProfile(this.userId, this.profileForm.value).subscribe(response => {
            Swal.fire(
              'สำเร็จ!',
              'โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.',
              'success'
            );
          }, error => {
            Swal.fire(
              'ผิดพลาด!',
              'ไม่สามารถอัปเดตโปรไฟล์ได้.',
              'error'
            );
          });
        } else {
          Swal.fire(
            'ผิดพลาด!',
            'ข้อมูลในฟอร์มไม่ถูกต้อง.',
            'error'
          );
        }
      }
    });
  }

  changePassword(): void {
    if (this.newPassword === this.confirmPassword) {
      if (this.newPassword.length >= 6) { // เพิ่มความปลอดภัย รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
        Swal.fire({
          title: 'ยืนยันการเปลี่ยนรหัสผ่าน?',
          text: "คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนรหัสผ่านนี้?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ใช่, เปลี่ยน!',
          cancelButtonText: 'ยกเลิก'
        }).then((result) => {
          if (result.isConfirmed) {
            this.profileService.changePassword(this.userId, this.newPassword).subscribe(response => {
              Swal.fire(
                'สำเร็จ!',
                'รหัสผ่านของคุณได้ถูกเปลี่ยนแล้ว.',
                'success'
              );
            }, error => {
              Swal.fire(
                'ผิดพลาด!',
                'ไม่สามารถเปลี่ยนรหัสผ่านได้.',
                'error'
              );
            });
          }
        });
      } else {
        Swal.fire(
          'ผิดพลาด!',
          'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร.',
          'error'
        );
      }
    } else {
      Swal.fire(
        'ผิดพลาด!',
        'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน.',
        'error'
      );
    }
  }
}
