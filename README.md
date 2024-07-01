This repository contains a project with a Django backend and a Next.js frontend. Follow the instructions below to set up and run the project locally.

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm 6+
- MySQL(or any other database you plan to use with Django)

## Setup

### 1. Clone the repository

    git clone https://github.com/Employee-Management-Tool-main
    cd your Employee-Management-Tool-main


### 2. Set up the Django Backend
### 2.1 Create and activate a virtual environment
    sudo apt install python3.10-venv
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

### 2.2 Setup a database using MySQL
    create database name;
> Update the details of mysql database in the .env file whose example file is added and save it as .env.

### 2.2.1 install the python requirements
    pip install -r requirements.txt

### 2.3 Apply database migrations
    python manage.py makemigrations

### 2.31 Apply database migrations
    python manage.py migrate
    
### 2.4 Create a superuser
    python manage.py createsuperuser
    
### 2.5 Run the Django development server
    python manage.py runserver
    
### 2.6 Login to django administrator using superuser and password
>open backend url and navigate to admin then login.



### 3. Set up the Next.js Frontend
### 3.1 Install the required Node packages
    cd em_frontend
    npm install
    npm install react-toastify
    npm install @heroicons/react@v1


    
### 3.2 Run the Next.js development server and go to the login page using the url
    npm run dev
    http://localhost:3000/


## Backend Features
>added jwt tokens  
>can verify in postman  
>you can directly assign role to a employee through endpoints and add employees too  

## steps  to assign role and add eployees through postman endpoint

### 1.Get your access token from this address

        url: http://127.0.0.1:8000/api/token/
-method : post
### 2. Assign Roles

        url: http://127.0.0.1:8000/api/roles/<role_id>/assign_role/
        
-Method: POST  
-Headers: Authorization: Bearer your_access_token
-Body: json 
```json
{
    "employee_id" : 5
}  
  ```
### 3. Add Employees
Endpoint:  

        URL: http://127.0.0.1:8000/api/employees/
        
Method: POST    
Headers:    
Authorization: Bearer your_access_token    
Body: (raw JSON)
```json
{  
    "user": 1,  
    "department": 1,  
    "role": 11,  
    "first_name": "john",  
    "last_name": "doe",  
    "email": "example@email.com",  
    "phone_number": "1234567890"  
}
```

## The swagger api documentation and ReDoc is also added.
### steps to access the:
>directly go to main page and you can find swagger docs and redoc button
>or you can use the following url  
        http://127.0.0.1:8000/swagger/  
        http://127.0.0.1:8000/redoc/






 ### WARNING
-After creating virtual environment for django backend,you need to install all the neccesary tools needed   
-ensure python,django,node,etc are preinstalled.   
-use this code if pkg module is not found   
>pip install --upgrade setuptools
    
-Ensure once the database is created,don't use it again for making the same migrations.It will overlap the models and data.


    
