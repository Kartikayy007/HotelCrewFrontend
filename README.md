[HotelCrew

# Overview

HotelCrew is a comprehensive platform designed to enhance staff management, streamline hotel operations, and improve customer experience. It caters to various roles within the hotel industry, including administrators (Admin and Manager) and staff members.

## Snapshots

Below are screenshots demonstrating the user roles and their interfaces.

###   Admin 

<div style="display: flex; gap: 10px;">
<img src="./assets/admin/ADashboard1.png" alt="Admin Dashboard" width="350" />
<img src="./assets/admin/ADashboard2.png" alt="Admin Dashboard" width="350" />
</div>
<br/>
<div style="display: flex; gap: 10px;">
<img src="./assets/admin/AAnalytics.png" alt="Admin Analytics 1" width="350" />
<img src="./assets/admin/AAnalytics2.png" alt="Admin Analytics 2" width="350" />
<img src="./assets/admin/AAnalytics3.png" alt="Admin Analytics 3" width="350" />
</div>
<br/>
<div style="display: flex; gap: 10px;">
<img src="./assets/admin/ADatabase1.png" alt="Admin Database 1" width="350" />
<img src="./assets/admin/ADatabase2.png" alt="Admin Database 2" width="350" />
<img src="./assets/admin/ADatabase3.png" alt="Admin Database 3" width="350" />
</div>
<br/>
<div style="display: flex; gap: 10px;">
<img src="./assets/admin/ALeave.png" alt="Admin Leave" width="350" />
<img src="./assets/admin/ASettings1.png" alt="Admin Settings 2" width="350" />
<img src="./assets/admin/ASettings2.png" alt="Admin Settings 3" width="350" />
</div>

###  Manager 

<div style="display: flex; gap: 10px;">
<img src="./assets/manager/MDashboard1.png" alt="Manager Dashboard" width="350" />
<img src="./assets/manager/MDashboard2.png" alt="Manager Dashboard" width="350" />
<img src="./assets/manager/MSchedule.png" alt="Manager Schedule" width="350" />
</div>
<br/>
<div style="display: flex; gap: 10px;">
<img src="./assets/manager/MAnalytics.png" alt="Manager Analytics 1" width="350" />
<img src="./assets/manager/MAttendance1.png" alt="Manager Attendance 2" width="350" />
<img src="./assets/manager/MAttendance2.png" alt="Manager Attendance 2" width="350" />
<img src="./assets/manager/MLeave.png" alt="Manager Leave" width="350" />
</div>
<br/>
<div style="display: flex; gap: 10px;">
<img src="./assets/manager/MDatabase1.png" alt="Manager Database 1" width="350" />
<img src="./assets/manager/MDatabase2.png" alt="Manager Database 2" width="350" />
<img src="./assets/manager/MProfile.png" alt="Manager Profile" width="350" />
</div>

### Receptionist 

<div style="display: flex; gap: 10px;">
  <img src="./assets/reception/RDashboard.png" alt="Receptionist Dashboard" width="350" />
  <img src="./assets/reception/RDatabase.png" alt="Receptionist Database" width="350" />
  <img src="./assets/reception/RTask.png" alt="Receptionist Task" width="350" />
  <img src="./assets/reception/RSchedule.png" alt="Receptionist Schedule" width="350" />
  <img src="./assets/reception/RProfile.png" alt="Receptionist Profile" width="350" />
</div>  

### Staff 

<div style="display: flex; gap: 10px;">
  <img src="./assets/staff/SDashboard.png" alt="Staff Dashboard" width="350" />
  <img src="./assets/staff/STask.png" alt="Staff Task" width="350" />
  <img src="./assets/staff/SSchedule.png" alt="Staff Schedule" width="350" />
  <img src="./assets/staff/SProfile.png" alt="Staff Profile" width="350" />
</div>  


## Features

### Authentication:
- Role-based authentication for admin, manager, and staff
- Secure login system
- Utilize JWT for stateless authentication
- Password reset functionality

### Staff Management:
- Comprehensive staff directory including:
  - Reception
  - Housekeeping staff
  - Security staff
  - Maintenance staff
  - Kitchen staff
  - Parking staff
- Task assigning system
- Leave management system
- Attendance tracking
- Shift management and shift swapping

### Intra/Inter Department Communication:
- Push notification system facilitates coordination and task assignment across departments
- Chat room functionality enables real-time communication between admin and managers, as well as between managers and staff, including reception and other team members
- Announcement channel works as a centralized platform for hotel-wide updates and important information

### Staff Wellness:
- Working hours tracker for staff
- Badge-based and incentive system for overtime

### Hotel Services Management:
- Parking management
- Room status and management
- Inventory management:
  - Hotel resources tracking and updating system
  - Alert for restocking and overstocking

## User Roles

1. **Admin**: The admin oversees overall management of the hotel system, with access to all features and data, and makes announcements. They have a comprehensive overview of staff performance and supervise overall expenses ensuring efficient and effective hotel operations.
2. **Manager**: The manager can perform CRUD operations to hire or fire staff based on performance, keep check on attendance and leave management, and schedule shifts for optimal coverage. They oversee VIP check-ins and supervise maintenance staff to ensure facilities are well maintained. Additionally, the manager reviews daily services to ensure quality.
3. **Staff**: Members have access to role-specific features that improve efficiency, including task status tracking, leave requests, and schedule management. They receive task assignments through a notification-based system or utilize chat functionality, manage attendance, and stay updated on important announcements. Additionally, staff can monitor their performance, view incentives, and access badges earned, ensuring streamlined operations to provide quality service.
4. **Receptionist**: The receptionist manages front desk operations including guest check-in/check-out, reservation management, and customer request handling through the platform's dashboard system. They monitor room status, parking valet, and expense tracking while coordinating and assigning tasks to respective staff. Through the system, they can manage tasks and utilize internal communication tools like chat and notification systems to ensure smooth hotel operations.

## Tech Stack

- **Frontend: Flutter**
  - Flutter is a powerful framework that allows developers to create high-performance mobile apps for both iOS and Android.
- **Frontend: React**
  - React is a powerful JavaScript library whose component-driven architecture makes it suitable for developing interactive web applications.
- **Backend: Django**
  - Django is a powerful and versatile web framework for Python that streamlines the process of building secure, scalable applications.

## Future Enhancement

In upcoming updates, we plan to introduce additional features such as an automated attendance system that records staff check-ins when their devices connect to the hotel’s Wi-Fi network. We also envision integrating payroll management for admins, alongside a customer portal to handle customer-side operations efficiently.

](https://hotelcrew-1.onrender.com/admin)
