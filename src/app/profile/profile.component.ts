import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

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
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.userId, this.profileForm.value).subscribe(response => {
        console.log('Profile updated successfully');
      }, error => {
        console.error('Error updating profile', error);
      });
    } else {
      console.error('Profile form is invalid');
    }
  }

  changePassword(): void {
    if (this.newPassword === this.confirmPassword) {
      if (this.newPassword.length >= 6) { // เพิ่มความปลอดภัย รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
        this.profileService.changePassword(this.userId, this.newPassword).subscribe(response => {
          console.log('Password changed successfully');
        }, error => {
          console.error('Error changing password', error);
        });
      } else {
        console.error('New password must be at least 6 characters long');
      }
    } else {
      console.error('Passwords do not match');
    }
  }
}
