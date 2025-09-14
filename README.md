# Wasim OJ

Online Judge platforms are online coding platforms where users solve algorithmic problems by coding solutions and testing them against predefined test cases to receive verdicts. This platform supports two roles: User and Admin. Users can read, code, and submit solutions, while Admins have additional privileges to create and delete, read, edit the problem created by that Admin.

## Demo Video 
[Link to Demo Video](https://www.loom.com/share/337fcf078b694891be210dca00819c56?sid=b9850739-6f65-487e-9656-526b44ecd382)

### Home
![Screenshot 2024-06-10 192240](https://github.com/wasim395/OJ_Project_394/assets/168566160/c3021275-e7d8-48ed-bf06-d50f9d3afd70)
### Problem Page
![Screenshot 2024-06-11 025858](https://github.com/wasim395/OJ_Project_394/assets/168566160/dec9dd09-215b-4fd2-bd6f-5c95396aa9ce)
![Screenshot 2024-06-10 192350](https://github.com/wasim395/OJ_Project_394/assets/168566160/0393321c-2490-49e0-ae1b-20ec68885f39)
### Admin Page
![Screenshot 2024-06-10 192406](https://github.com/wasim395/OJ_Project_394/assets/168566160/a9d53808-354d-4c7f-a6d1-f57a03807d6b)

## Features

1. **Problem Repository**
   - Access to a vast repository of programming problems.

2. **User Registration and Profiles**
   - User registration system to create accounts.
   - Email verification with OTP for account security.
   - User profiles to track submissions, and problem created by Admin .

3. **Code Editor and Compiler**
   - Integrated code editor with syntax highlighting and code completion features.
   - Support for c++ languages.
   - Online compiler to compile and execute code submissions.

4. **Submission System**
   - Easy process for users to submit their code solutions.
   - Get instant feedback on your code, including any errors.
   - Your submissions are securely stored for later review.

5. **Judging System**
   - Automatic judging system to evaluate code submissions against test cases.
   - Support for multiple test cases per problem to ensure accuracy.
   - Immediate feedback on the correctness of solutions.

6. **Admin Problem Management**
   - Exclusive access for administrators to create, read, edit, and delete problems they have created.

## Installation

1. Clone the repository

```bash
  git clone https://github.com/wasim395/OJ_Project_394.git
```

2. Go to the project directory and install dependencies for both the frontend and backend

```bash
  cd frontend
  npm install
```
```bash
  cd backend
  npm install
```
3. Create a .env file in both the frontend and backend directories and add the environment variables as shown bellow .

4. Start the server

```bash
  npm run dev
```

5. Start the server

```bash
  nodemon index.js 
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Backend 

`MONGO_URL` : To connect with mongoDB Atlas database

`SecretKey` : JWT secret key 

`PORT` : port on which your backend is running .

`EMAIL_ID` : OTP will be send through this Email ID 

`EMAIL_PASS` 


### Frontend 

`VITE_SERVER_URL` : To connect front end with backend.

## Frontend Technology Stack

- **Framework/Library**: React.js with Vite
- **Deployment**: Vercel
- **Styling**: CSS Modules
- **HTTP Client**: Axios

## Backend Technology Stack

- **Runtime**: Docker (with Node.js)
  - Node.js is running inside a Docker container on an AWS EC2 instance, providing a consistent and isolated server environment.
- **Deployment**: AWS EC2 Instance
  - The Dockerized Node.js server is deployed and running on an AWS EC2 instance, providing scalability and flexibility.
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email Verification**: Nodemailer
- **CORS**: Cross-Origin Resource Sharing
- **Compiler**: GCC (GNU Compiler Collection) 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License

[MIT](https://choosealicense.com/licenses/mit/)
