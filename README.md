# Digital Grades

Digital Grades is an academic management web application for administrators,
professors, and students. It supports user accounts, class assignment, grade
form submission, administrator approval, and student grade viewing.

## Technology used

- **Frontend:** Angular (already compiled and included in the Java application)
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Database:** MySQL

Node.js is **not required** to run the finished application.

## Requirements

- Java 21 or later
- MySQL Server running on port `3306`
- A web browser

## First-time MySQL setup

Open a terminal and sign in as the MySQL root user:

```bash
mysql -u root -p
```

At the `mysql>` prompt, create the database and the application account. Replace
`ChooseYourOwnPassword` with a private password of your choice.

```sql
CREATE DATABASE IF NOT EXISTS digital_grades
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'digitalgrades_app'@'localhost'
  IDENTIFIED BY 'ChooseYourOwnPassword';

ALTER USER 'digitalgrades_app'@'localhost'
  IDENTIFIED BY 'ChooseYourOwnPassword';

GRANT ALL PRIVILEGES ON digital_grades.* TO 'digitalgrades_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Import the included project data

If `backend/digital_grades.sql` is included, import the saved users, classes,
and grade forms:

```bash
mysql -u root -p digital_grades < backend/digital_grades.sql
```

## Run the application

From the project folder:

```bash
cd backend
./run-mysql.sh
```

Enter the password for `digitalgrades_app` when asked. When the terminal says
`Started DigitalGradesApplication`, open this address in a browser:

```text
http://localhost:8080
```

Keep the terminal open while using the application. To stop the server, press
`Control + C` in that terminal.

## Export the project data

To create a database backup that can be sent with the project:

```bash
cd backend
./export-mysql.sh
```

The backup is saved as `backend/digital_grades.sql`.

## Project structure

```text
digital-grades/
├── backend/
│   ├── src/main/java/          Java Spring Boot source code
│   ├── src/main/resources/     Configuration and compiled web interface
│   ├── target/                Ready-to-run Java application JAR
│   ├── run-mysql.sh           Starts the app with MySQL
│   ├── export-mysql.sh        Exports MySQL data to an SQL file
│   └── digital_grades.sql     Optional database backup
└── src/                       Angular frontend source code
```

## Troubleshooting

| Problem | Solution |
| --- | --- |
| `Access denied for user 'digitalgrades_app'` | The password entered does not match the MySQL application account. Reset the account password in MySQL, then use that same password with `run-mysql.sh`. |
| `localhost:8080` does not open | Confirm that the terminal says `Started DigitalGradesApplication` and keep that terminal open. |
| MySQL connection refused | Start the MySQL Server, then run `./run-mysql.sh` again. |
| Port 8080 is already in use | Stop the other Java application using port 8080, then start this project again. |

## Academic note

This project was created as an educational academic-management application.
