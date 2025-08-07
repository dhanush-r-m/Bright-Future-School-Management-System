# School Management System

A comprehensive school management system built with Node.js, Express.js, and MongoDB. This system manages four main user profiles: Students, Teachers, Parents, and Administrators.

## Features

### Student Management
- Personal information (Name, DOB, Father's name, Mother's name, Address)
- Admission details and roll number assignment
- Class and section management
- Parent-student relationship tracking

### Teacher Management
- Personal and professional information
- Subject specializations and qualifications
- Class teacher assignments
- Employee ID and contact details

### Parent Management
- Ward (student) details and relationships
- Academic score tracking for children
- Fee payment history and status
- Communication preferences

### Admin Management
- Complete school oversight and data management
- Timetable creation and management
- Document and circular management
- Curriculum planning and tracking
- Comprehensive reporting and analytics

## Technology Stack

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js, CORS
- **Logging**: Morgan
- **Environment**: dotenv for configuration

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

4. **Start MongoDB**
   - Make sure MongoDB is installed and running on your system
   - Or use MongoDB Atlas (cloud database)

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Application and database health status

### Student Endpoints
- `POST /api/students` - Create new student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/class/:className` - Get students by class

### Teacher Endpoints
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/teachers/subject/:subject` - Get teachers by subject
- `PUT /api/teachers/:id/assign-class/:className` - Assign class teacher

### Parent Endpoints
- `POST /api/parents` - Create new parent
- `GET /api/parents` - Get all parents
- `GET /api/parents/:id` - Get parent by ID
- `PUT /api/parents/:id` - Update parent
- `POST /api/parents/:id/scores` - Add ward score
- `POST /api/parents/:id/payments` - Add fee payment
- `GET /api/parents/:parentId/scores/:studentId` - Get ward scores
- `GET /api/parents/:parentId/payments` - Get fee payment history

### Admin Endpoints

#### Timetable Management
- `POST /api/admin/timetable` - Create timetable
- `GET /api/admin/timetable/:className` - Get class timetable
- `PUT /api/admin/timetable/:id` - Update timetable

#### Documentation
- `POST /api/admin/documents` - Add document
- `GET /api/admin/documents` - Get all documents
- `GET /api/admin/documents/:type` - Get documents by type

#### Circulars
- `POST /api/admin/circulars` - Create circular
- `GET /api/admin/circulars` - Get all circulars
- `GET /api/admin/circulars/:audience` - Get circulars by audience

#### Curriculum
- `POST /api/admin/curriculum` - Add curriculum
- `GET /api/admin/curriculum/:className` - Get curriculum by class

#### Reports & Analytics
- `GET /api/admin/statistics` - School statistics
- `GET /api/admin/users` - All users overview
- `GET /api/admin/reports/attendance/:className` - Attendance reports
- `GET /api/admin/reports/fees` - Fee status reports

## Database Schema Overview

### Student Schema
```javascript
{
  name: String (required),
  dob: Date (required),
  fatherName: String (required),
  motherName: String (required),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  admissionDate: Date (required),
  class: String (required),
  rollNumber: String (required, unique),
  parentId: ObjectId (ref: Parent)
}
```

### Teacher Schema
```javascript
{
  name: String (required),
  dob: Date (required),
  address: Object,
  subjectsHandling: [String] (required),
  qualifications: [Object],
  employeeId: String (required, unique),
  joiningDate: Date (required),
  classTeacher: String,
  phone: String (required),
  email: String (required, unique),
  salary: Number (required)
}
```

### Parent Schema
```javascript
{
  name: String (required),
  dob: Date (required),
  wardDetails: [Object],
  wardScores: [Object],
  feePayments: [Object],
  phone: String (required),
  email: String (required, unique),
  address: Object,
  occupation: String,
  emergencyContact: Object
}
```

### Admin Schemas
- **Timetable**: Class schedules with teacher assignments
- **Documentation**: School documents and forms
- **Circulars**: Announcements and communications
- **Curriculum**: Subject syllabi and learning objectives

## Usage Examples

### Creating a Student
```javascript
POST /api/students
{
  "name": "John Doe",
  "dob": "2010-05-15",
  "fatherName": "Robert Doe",
  "motherName": "Jane Doe",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "pincode": "12345"
  },
  "admissionDate": "2024-04-01",
  "class": "Grade 8",
  "rollNumber": "G8-001"
}
```

### Adding a Fee Payment
```javascript
POST /api/parents/:parentId/payments
{
  "studentId": "student_object_id",
  "term": "Term 1",
  "amount": 5000,
  "paymentDate": "2024-08-01",
  "paymentMethod": "Online",
  "receiptNumber": "RCP-2024-001"
}
```

### Creating a Timetable
```javascript
POST /api/admin/timetable
{
  "class": "Grade 8",
  "day": "Monday",
  "periods": [
    {
      "periodNumber": 1,
      "subject": "Mathematics",
      "teacherId": "teacher_object_id",
      "teacherName": "Ms. Smith",
      "startTime": "09:00",
      "endTime": "09:45"
    }
  ]
}
```

## File Structure

```
school-management-system/
├── app.js              # Main application file
├── database.js         # Database configuration
├── student.js          # Student model and controller
├── teacher.js          # Teacher model and controller
├── parent.js           # Parent model and controller
├── admin.js           # Admin models and controller
├── package.json        # Dependencies and scripts
├── .env.example       # Environment variables template
└── README.md          # Documentation
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Database Seeding
```bash
npm run seed
```

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: API rate limiting (configurable)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

## Roadmap

- [ ] Authentication and authorization system
- [ ] File upload for documents and images
- [ ] Email notifications
- [ ] Mobile app integration
- [ ] Advanced reporting and analytics
- [ ] Attendance tracking system
- [ ] Online examination system
- [ ] Library management integration