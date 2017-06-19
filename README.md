![## Smart Rods](./smartrods/static/img/login-logo.png) 



This is the online repository for the SmartRods project. 

The demonstration version of the application is available [here](http://app.smartrods.co.uk). 

The API documentation is available [here](http://pierreazalbert.github.io/smartrods)

## Application description

The Smart Rods application is based on the [Flask](http://flask.pocoo.org) framework, written in Python. 

There are two distinct modules in the application which have been implemented as [Blueprints](http://flask.pocoo.org/docs/0.12/blueprints/) for better isolation and organisation of code. The Site module serves all the files necessary to display the application in a client browser, and the API module acts as an interface between the PostgreSQL database and the application front end. The 


## Running the application locally

To run the application locally on your computer, simply clone the repository and run the following commands in terminal. You will need to have `virtualenv` installed (documentation [here](https://virtualenv.pypa.io/en/stable/)). It allows to create an isolated python environment, which doesn't affect the python configuration on your machine and is more representative of the environment on a remote server.

Before launching the application you must create a `config.py` file based on the example given in `config.example.py`, and replace the database address and credentials with valid information, otherwise the application will not work. The project includes the Flask-Migrate package which allows for very easy management of the database, see documentation [here](https://github.com/miguelgrinberg/flask-migrate/).


```
# create virtual environment, call it flask
virtualenv flask

# install all required packages using the requirements list
flask/bin/pip install -r requirements.txt

# initialise the database using the flask-migrate methods
flask/bin/python manage.py db init

# run the application on local host (usually 127.0.0.1:5000)
flask/bin/python application.py
```

## Deploying the application to the cloud

The demonstration version of the application was deployed to the cloud using [Amazon Web Services](https://aws.amazon.com), more specifically using [Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/?nc2=h_m1) and [Amazon Elastic Beanstalk (EB)](https://aws.amazon.com/elasticbeanstalk/?nc2=h_m1). Deployment to AWS can be done really easily in terminal using the [AWS Command Line Interface](https://aws.amazon.com/cli/).

The initial setup is done as shown below:

```
# install AWS CLI on your machine (not in virtual environment of your app)
pip install awscli

# initialise elastic beanstalk repository
eb init -p python2.7 your-app-name

# run eb init again to configure SSH key pairs
# after going through this process, you can SSH into your remote instance by using eb ssh
eb init 

# create environment and deploy application to cloud
eb create flask-env

# after environment init is done you can go to your app with eb open
eb open
```

As you change the code in the application, you can update the cloud version using the `eb deploy` command which will upload the latest version of your code to the remote instance and reboot your application.
